# API Documentation

## Overview

The AI Ticket Booking Chatbot provides several API endpoints and JavaScript interfaces for managing the booking process.

## Table of Contents

- [Speech Recognition API](#speech-recognition-api)
- [Payment Processing](#payment-processing)
- [OTP Service](#otp-service)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

## Speech Recognition API

### Web Speech API Integration

The chatbot uses the browser's built-in Web Speech API for voice recognition.

#### Configuration
```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.lang = language; // 'en-US', 'hi-IN', 'bn-BD'
```

#### Supported Languages
- **English**: `en-US`
- **Hindi**: `hi-IN`
- **Bengali**: `bn-BD`

#### Event Handlers
- `onstart`: Recognition starts
- `onend`: Recognition ends
- `onresult`: Speech results available
- `onerror`: Error occurred

## Payment Processing

### QR Code Generation

#### Endpoint
External API: `https://api.qrserver.com/v1/create-qr-code/`

#### Parameters
- `size`: QR code dimensions (e.g., "200x200")
- `data`: UPI payment link

#### UPI Link Format
```
upi://pay?pa=[UPI_ID]&am=[AMOUNT]&tn=[TRANSACTION_NOTE]
```

#### Example
```javascript
const upiLink = `upi://pay?pa=ayushmondal139@okhdfcbank&am=100&tn=Museum Ticket Booking`;
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
```

## OTP Service

### Endpoint
`POST /send_otp.php`

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phone | string | Yes | Phone number with country code |
| name | string | No | Customer name |
| email | string | No | Customer email |
| transactionId | string | No | Payment transaction ID |

### Request Example
```javascript
$.ajax({
    url: 'send_otp.php',
    type: 'POST',
    data: {
        phone: '+1234567890',
        name: 'John Doe',
        email: 'john@example.com',
        transactionId: 'TXN123456789'
    },
    success: function(response) {
        console.log(response);
    }
});
```

### Response Format
```json
{
    "success": true,
    "message": "OTP sent successfully"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error message description"
}
```

### Error Codes
- `400`: Bad Request (invalid input)
- `405`: Method Not Allowed
- `500`: Internal Server Error

## Data Models

### User Data Object
```javascript
const userData = {
    name: '',           // User's full name
    phone: '',          // Phone number with country code
    bookingOpinion: '', // Yes/No for booking confirmation
    showName: '',       // Selected museum show name
    showPrice: 0,       // Price per ticket
    ticketCount: 0,     // Number of tickets
    totalPrice: 0       // Total calculated price
};
```

### Show Object
```javascript
const show = {
    name: 'Ancient Artifacts Exhibition',
    price: 100
};
```

### Available Shows
```javascript
const shows = [
    { name: 'Ancient Artifacts Exhibition', price: 100 },
    { name: 'Modern Art Gallery', price: 150 },
    { name: 'Science & Technology Wing', price: 200 }
];
```

## Error Handling

### Client-Side Validation

#### Phone Number Validation
```javascript
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{7,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
```

#### Email Validation
```javascript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = emailPattern.test(email);
```

### Server-Side Validation

#### Input Sanitization
```php
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
```

#### Phone Number Validation
```php
function validatePhoneNumber($phone) {
    $cleanPhone = preg_replace('/[^\d+]/', '', $phone);
    return preg_match('/^\+?[1-9]\d{7,14}$/', $cleanPhone);
}
```

## Security Considerations

### API Key Management
- Store API keys in environment variables
- Never commit sensitive credentials to version control
- Use placeholder values in demo environments

### Input Validation
- Validate all user inputs on both client and server side
- Sanitize inputs to prevent injection attacks
- Implement rate limiting for API endpoints

### CORS Configuration
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
```

## Rate Limiting

### Recommendations
- Implement rate limiting for OTP requests (e.g., 3 requests per phone number per hour)
- Add CAPTCHA for repeated requests
- Monitor for suspicious activity patterns

## Testing

### Manual Testing
1. Test voice recognition in different browsers
2. Verify payment QR code generation
3. Test OTP functionality with valid phone numbers
4. Validate error handling for edge cases

### Automated Testing
- HTML validation
- CSS linting
- JavaScript syntax checking
- Security scanning

## Browser Compatibility

### Supported Browsers
- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Limited speech recognition)
- **Safari**: 11+ (Limited speech recognition)
- **Edge**: 79+ (Full support)

### Feature Detection
```javascript
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Speech recognition supported
} else {
    // Fallback to text input only
}
```

## Performance Optimization

### Best Practices
- Minimize DOM manipulation
- Use event delegation for dynamic elements
- Implement proper loading states
- Optimize image sizes and formats
- Use CDN for external dependencies

## Deployment

### Environment Variables
```bash
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=MUSEUM
SMS_API_URL=https://smsapi.example.com/send
```

### Web Server Configuration
- Enable HTTPS in production
- Configure proper CORS headers
- Set up proper error logging
- Implement security headers

## Troubleshooting

### Common Issues

#### Speech Recognition Not Working
- Check browser compatibility
- Verify microphone permissions
- Ensure HTTPS connection (required for speech API)

#### Payment QR Code Not Loading
- Verify internet connection
- Check QR API service status
- Validate UPI link format

#### OTP Not Received
- Verify phone number format
- Check SMS API configuration
- Review server logs for errors

### Debug Mode
Enable console logging for debugging:
```javascript
console.log('Debug information:', data);
```