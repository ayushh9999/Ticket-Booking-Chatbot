<?php
/**
 * OTP Generation and SMS Sending Service
 * 
 * This script handles OTP generation and sends SMS notifications
 * for ticket booking confirmation.
 * 
 * @author Ayush Mondal
 * @version 1.0
 */

// Set content type to JSON
header('Content-Type: application/json');

// Enable CORS for frontend requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

/**
 * Generate a secure random OTP
 * 
 * @param int $length Length of the OTP (default: 6)
 * @return string Generated OTP
 * @throws InvalidArgumentException If length is invalid
 */
function generateSecureOtp($length = 6) {
    // Validate input
    if ($length < 4 || $length > 10) {
        throw new InvalidArgumentException('OTP length must be between 4 and 10 digits');
    }
    
    $otp = '';
    for ($i = 0; $i < $length; $i++) {
        $otp .= mt_rand(0, 9);
    }
    return $otp;
}

/**
 * Validate phone number format
 * 
 * @param string $phone Phone number to validate
 * @return bool True if valid, false otherwise
 */
function validatePhoneNumber($phone) {
    // Remove any non-digit characters except +
    $cleanPhone = preg_replace('/[^\d+]/', '', $phone);
    
    // Check if phone number is valid (basic validation)
    return preg_match('/^\+?[1-9]\d{7,14}$/', $cleanPhone);
}

/**
 * Send OTP via SMS API
 * 
 * @param string $phone Phone number
 * @param string $otp OTP to send
 * @return bool True if sent successfully, false otherwise
 */
function sendOtpSms($phone, $otp) {
    // Get API configuration from environment variables (recommended)
    $apiKey = getenv('SMS_API_KEY') ?: 'YOUR_SMS_API_KEY';
    $senderId = getenv('SMS_SENDER_ID') ?: 'MUSEUM';
    $apiUrl = getenv('SMS_API_URL') ?: 'https://smsapi.example.com/send';
    
    // Check if API is configured
    if ($apiKey === 'YOUR_SMS_API_KEY') {
        // For demo purposes, simulate successful sending
        error_log("Demo Mode: OTP $otp would be sent to $phone");
        return true;
    }
    
    $message = "Your museum ticket booking OTP is: $otp. Valid for 5 minutes.";
    
    // Prepare API request
    $postData = [
        'apiKey' => $apiKey,
        'senderId' => $senderId,
        'phone' => $phone,
        'message' => $message
    ];
    
    // Send SMS using cURL for better error handling
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($postData),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Check if request was successful
    return $response !== false && $httpCode === 200;
}

// Main request handling
try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            'success' => false, 
            'error' => 'Method not allowed'
        ]);
        exit;
    }
    
    // Validate and sanitize input
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    
    if (empty($phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Phone number is required'
        ]);
        exit;
    }
    
    // Validate phone number format
    if (!validatePhoneNumber($phone)) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Invalid phone number format'
        ]);
        exit;
    }
    
    // Generate OTP
    $otp = generateSecureOtp(6);
    
    // In production, save OTP to database with expiration time
    // For now, we'll just log it
    error_log("Generated OTP for $phone: $otp");
    
    // Send OTP via SMS
    $smsSent = sendOtpSms($phone, $otp);
    
    if ($smsSent) {
        // Success response
        echo json_encode([
            'success' => true,
            'message' => 'OTP sent successfully'
        ]);
    } else {
        // SMS sending failed
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send OTP. Please try again.'
        ]);
    }
    
} catch (Exception $e) {
    // Handle any unexpected errors
    error_log("OTP Service Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error'
    ]);
}
?>
