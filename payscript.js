/**
 * Payment Processing Script
 * 
 * Handles UPI payment generation, QR code creation, and OTP verification
 * for museum ticket booking confirmation.
 * 
 * @author Ayush Mondal
 * @version 1.0
 */

$(document).ready(function() {
    
    /**
     * Display error message to user
     * @param {string} message - Error message to display
     */
    const showError = (message) => {
        alert(`Error: ${message}`);
        console.error('Payment Error:', message);
    };

    /**
     * Display success message to user
     * @param {string} message - Success message to display
     */
    const showSuccess = (message) => {
        alert(`Success: ${message}`);
        console.log('Payment Success:', message);
    };

    /**
     * Validate form inputs
     * @returns {object} Validation result with status and errors
     */
    const validateInputs = () => {
        const name = $(".name").val().trim();
        const phone = $(".number").val().trim();
        const email = $(".email").val().trim();
        
        const errors = [];
        
        // Validate name
        if (!name || name.length < 2) {
            errors.push("Name must be at least 2 characters long");
        }
        
        // Validate phone number
        const phonePattern = /^[\+]?[1-9][\d]{7,14}$/;
        if (!phone || !phonePattern.test(phone.replace(/\s/g, ''))) {
            errors.push("Please provide a valid phone number");
        }
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            errors.push("Please provide a valid email address");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            data: { name, phone, email }
        };
    };

    /**
     * Load booking data from session storage
     */
    const loadBookingData = () => {
        try {
            const bookingData = sessionStorage.getItem('bookingData');
            if (bookingData) {
                const data = JSON.parse(bookingData);
                console.log('Loaded booking data:', data);
                
                // Pre-fill name and phone if available
                if (data.name) $(".name").val(data.name);
                if (data.phone) $(".number").val(data.phone);
                
                // Display booking summary
                if (data.showName && data.ticketCount && data.totalPrice) {
                    const summaryHtml = `
                        <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px;">
                            <h3>Booking Summary</h3>
                            <p><strong>Show:</strong> ${data.showName}</p>
                            <p><strong>Tickets:</strong> ${data.ticketCount}</p>
                            <p><strong>Total Amount:</strong> ₹${data.totalPrice}</p>
                        </div>
                    `;
                    $(".form").prepend(summaryHtml);
                }
            }
        } catch (error) {
            console.error('Error loading booking data:', error);
        }
    };

    // Load booking data on page load
    loadBookingData();

    /**
     * Generate QR code and show payment interface
     */
    $(".generate_qr").click(function() {
        try {
            const validation = validateInputs();
            
            if (!validation.isValid) {
                showError(validation.errors.join('\n'));
                return;
            }
            
            const { phone } = validation.data;
            
            // Hide form and show QR section
            $(".form").hide();
            $(".qr_code").show();
            
            // Generate UPI payment link
            const upiId = "ayushmondal139@okhdfcbank"; // UPI ID for payments
            const amount = getPaymentAmount(); // Get amount from booking data or default
            const transactionNote = `Museum Ticket Booking - ${phone}`;
            
            const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
            
            console.log('Generated UPI link:', upiLink);
            console.log('QR API URL:', qrApiUrl);
            
            // Set QR code image
            $(".get_qr").attr("src", qrApiUrl);
            
            // Update payment amount display
            $("#payment-amount").text(`₹${amount}`);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            showError('Failed to generate payment QR code. Please try again.');
        }
    });

    /**
     * Get payment amount from booking data or use default
     * @returns {number} Payment amount
     */
    const getPaymentAmount = () => {
        try {
            const bookingData = sessionStorage.getItem('bookingData');
            if (bookingData) {
                const data = JSON.parse(bookingData);
                if (data.totalPrice && data.totalPrice > 0) {
                    return data.totalPrice;
                }
            }
        } catch (error) {
            console.error('Error getting payment amount:', error);
        }
        
        // Default amount if no booking data
        return 100;
    };

    /**
     * Process payment confirmation and send OTP
     */
    $(".download_now").click(function() {
        try {
            const name = $(".name").val().trim();
            const phone = $(".number").val().trim();
            const email = $(".email").val().trim();
            const transactionId = $(".id").val().trim();
            
            // Validate all required fields
            if (!name || !phone || !email || !transactionId) {
                showError("Please fill all fields correctly");
                return;
            }
            
            // Validate transaction ID format (basic validation)
            if (transactionId.length < 8) {
                showError("Please provide a valid transaction ID (minimum 8 characters)");
                return;
            }
            
            // Disable button to prevent multiple submissions
            $(".download_now").prop('disabled', true).text('Processing...');
            
            // Send OTP for ticket confirmation
            sendOtp(phone, {
                name: name,
                email: email,
                transactionId: transactionId,
                bookingData: JSON.parse(sessionStorage.getItem('bookingData') || '{}')
            }, function(response) {
                $(".download_now").prop('disabled', false).text('Download Now');
                
                if (response && response.success) {
                    showSuccess("Payment confirmed! OTP sent to your phone number as a digital ticket confirmation.");
                    
                    // Clear session data after successful booking
                    sessionStorage.removeItem('bookingData');
                    
                    // Optionally redirect to success page or home
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                    
                } else {
                    const errorMsg = response && response.error 
                        ? response.error 
                        : "Failed to send OTP. Please verify your transaction ID and try again.";
                    showError(errorMsg);
                }
            });
            
        } catch (error) {
            console.error('Error processing payment confirmation:', error);
            showError('An error occurred while processing your payment. Please try again.');
            $(".download_now").prop('disabled', false).text('Download Now');
        }
    });

    /**
     * Send OTP via PHP backend
     * @param {string} phoneNumber - Phone number to send OTP
     * @param {object} additionalData - Additional booking/payment data
     * @param {function} callback - Callback function for response
     */
    function sendOtp(phoneNumber, additionalData, callback) {
        $.ajax({
            url: 'send_otp.php',
            type: 'POST',
            data: { 
                phone: phoneNumber,
                ...additionalData 
            },
            timeout: 15000, // 15 second timeout
            success: function(response) {
                try {
                    // Parse response if it's a string
                    const parsedResponse = typeof response === 'string' 
                        ? JSON.parse(response) 
                        : response;
                    callback(parsedResponse);
                } catch (error) {
                    console.error('Error parsing response:', error);
                    callback({ success: false, error: 'Invalid response from server' });
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', { xhr, status, error });
                
                let errorMessage = 'Failed to send OTP. ';
                if (status === 'timeout') {
                    errorMessage += 'Request timed out. Please try again.';
                } else if (status === 'error') {
                    errorMessage += 'Network error. Please check your connection.';
                } else {
                    errorMessage += 'Please try again later.';
                }
                
                callback({ success: false, error: errorMessage });
            }
        });
    }
    
    // Add some helpful UI improvements
    $(".form input").on('blur', function() {
        $(this).removeClass('error');
        if (!$(this).val().trim()) {
            $(this).addClass('error');
        }
    });
    
    // Add loading state for QR generation
    $(".generate_qr").on('click', function() {
        const button = $(this);
        button.prop('disabled', true).text('Generating...');
        setTimeout(() => {
            button.prop('disabled', false).text('NEXT');
        }, 2000);
    });
});

// Add some basic CSS for better UX
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    .qr_code {
        display: none;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
