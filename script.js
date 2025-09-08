/**
 * AI Museum Ticket Booking Chatbot
 * 
 * Features:
 * - Voice recognition in multiple languages
 * - Interactive conversation flow
 * - Museum show booking with pricing
 * - Integrated payment redirection
 * 
 * @author Ayush Mondal
 * @version 1.0
 */

document.addEventListener('DOMContentLoaded', (event) => {
    // DOM element references
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const chatLog = document.getElementById('chat-log');
    const enBtn = document.getElementById('en-btn');
    const hiBtn = document.getElementById('hi-btn');
    const bnBtn = document.getElementById('bn-btn');

    // Global variables
    let recognition; // Speech recognition instance
    let currentStep = 0; // Current conversation step tracker
    let language = 'en-US'; // Selected language (default: English)
    let isRecognitionActive = false; // Recognition state tracker
    
    // User data storage object
    let userData = {
        name: '',
        phone: '',
        bookingOpinion: '',
        showName: '',
        showPrice: 0,
        ticketCount: 0,
        totalPrice: 0
    };

    // Available museum shows with pricing
    const shows = [
        { name: 'Ancient Artifacts Exhibition', price: 100 },
        { name: 'Modern Art Gallery', price: 150 },
        { name: 'Science & Technology Wing', price: 200 }
    ];

    /**
     * Conversation steps for different languages
     * Each language has a complete conversation flow
     */
    const steps = {
        'en-US': [
            "Welcome! I'm a Museum Chatbot! What's your name?",
            "Please tell us your phone number.",
            "Would you like to book a ticket?",
            `Here are the available shows:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">Show</th>
                    <th style="text-align: left;">Price</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} rupees</td>
                </tr>
                `).join('')}
            </table>
            <br>Which show would you like to book? (Please provide the number)`,
            "How many tickets would you like to book?",
            "Do you want to proceed with the payment?"
        ],
        'hi-IN': [
            "स्वागत है! मैं एक म्यूज़ियम चैटबोट हूँ! आपका नाम क्या है?",
            "कृपया हमें अपना फोन नंबर बताएं।",
            "क्या आप टिकट बुक करना चाहेंगे?",
            `यहाँ उपलब्ध शो हैं:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">शो</th>
                    <th style="text-align: left;">कीमत</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} रुपये</td>
                </tr>
                `).join('')}
            </table>
            <br>आप कौन सा शो बुक करना चाहेंगे? (कृपया संख्या प्रदान करें)`,
            "आप कितने टिकट बुक करना चाहेंगे?",
            "क्या आप भुगतान जारी रखना चाहते हैं?"
        ],
        'bn-BD': [ // Bengali language steps
            "স্বাগতম! আমি একটি যাদুঘরের চ্যাটবট! আপনার নাম কি?",
            "দয়া করে আপনার ফোন নম্বর বলুন।",
            "আপনি কি একটি টিকিট বুক করতে চান?",
            `এখানে উপলব্ধ শোগুলি:<br>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th style="text-align: left; padding-right: 20px;">#</th>
                    <th style="text-align: left; padding-right: 20px;">শো</th>
                    <th style="text-align: left;">মূল্য</th>
                </tr>
                ${shows.map((show, index) => `
                <tr>
                    <td style="padding-right: 20px;">${index + 1}</td>
                    <td style="padding-right: 20px;">${show.name}</td>
                    <td>${show.price} টাকা</td>
                </tr>
                `).join('')}
            </table>
            <br>আপনি কোন শো বুক করতে চান? (দয়া করে সংখ্যা প্রদান করুন)`,
            "আপনি কতগুলি টিকিট বুক করতে চান?",
            "আপনি কি পেমেন্ট করতে চান?"
        ]
    };

    /**
     * Display error message in chat
     * @param {string} message - Error message to display
     */
    const showError = (message) => {
        chatLog.innerHTML += `<div style="color: #ff6b6b;"><strong>Error:</strong> ${message}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    /**
     * Display bot message in chat
     * @param {string} message - Bot message to display
     */
    const showBotMessage = (message) => {
        chatLog.innerHTML += `<div><strong>Bot:</strong> ${message}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    /**
     * Display user message in chat
     * @param {string} message - User message to display
     */
    const showUserMessage = (message) => {
        chatLog.innerHTML += `<div><strong>User:</strong> ${message}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    /**
     * Validate phone number format
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid format
     */
    const validatePhoneNumber = (phone) => {
        // Basic phone number validation (digits and + symbol)
        const phoneRegex = /^[\+]?[1-9][\d]{7,14}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    /**
     * Progress to the next conversation step
     */
    const nextStep = () => {
        try {
            if (currentStep < steps[language].length) {
                showBotMessage(steps[language][currentStep]);
                currentStep++;
            } else {
                // Final confirmation message
                const finalMessage = language === 'hi-IN' 
                    ? `धन्यवाद, ${userData.name}। आपने ${userData.showName} के लिए ${userData.ticketCount} टिकट बुक किए हैं। आपका फोन नंबर ${userData.phone} है। आपका टिकट प्रोसेस हो रहा है!`
                    : language === 'bn-BD'
                    ? `ধন্যবাদ, ${userData.name}। আপনি ${userData.showName} এর জন্য ${userData.ticketCount}টি টিকিট বুক করেছেন। আপনার ফোন নম্বর ${userData.phone}। আপনার টিকিট প্রক্রিয়া করা হচ্ছে!`
                    : `Thank you, ${userData.name}. You have booked ${userData.ticketCount} tickets for ${userData.showName}. Your phone number is ${userData.phone}. Your ticket is being processed!`;
                
                showBotMessage(finalMessage);
                stopRecognition();
                return;
            }
        } catch (error) {
            console.error('Error in nextStep:', error);
            showError('An error occurred. Please try again.');
        }
    };

    /**
     * Stop speech recognition safely
     */
    const stopRecognition = () => {
        if (recognition && isRecognitionActive) {
            recognition.stop();
            isRecognitionActive = false;
        }
    };

    // Initialize speech recognition with browser compatibility
    try {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition(); // Chrome/Edge
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition(); // Firefox/Safari
        } else {
            throw new Error('Speech recognition not supported');
        }
    } catch (error) {
        console.error('Speech recognition initialization failed:', error);
        showError('Your browser does not support speech recognition. Please use a compatible browser like Chrome.');
        // Disable voice-related buttons
        startBtn.disabled = true;
        stopBtn.disabled = true;
    }

    // Configure speech recognition if available
    if (recognition) {
        recognition.continuous = true; // Keep listening
        recognition.interimResults = false; // Only final results
        recognition.maxAlternatives = 1; // Single best result

        // Speech recognition event handlers
        recognition.onstart = () => {
            console.log('Speech recognition started');
            isRecognitionActive = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            startBtn.textContent = 'Listening...';
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            isRecognitionActive = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            startBtn.textContent = 'Start';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecognitionActive = false;
            
            let errorMessage = 'Speech recognition error occurred.';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not available. Please check permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}`;
            }
            
            showError(errorMessage);
            
            // Reset button states
            startBtn.disabled = false;
            stopBtn.disabled = true;
            startBtn.textContent = 'Start';
        };

        // Process speech recognition results
        recognition.onresult = (event) => {
            try {
                let finalTranscript = '';

                // Extract final transcript from results
                for (let i = 0; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript = transcript.trim();
                    }
                }

                if (!finalTranscript) return;

                showUserMessage(finalTranscript);

                // Process user input based on current conversation step
                switch (currentStep) {
                    case 1: // Name input
                        if (finalTranscript.length < 2) {
                            showError('Please provide a valid name (at least 2 characters).');
                            currentStep--;
                        } else {
                            userData.name = finalTranscript;
                        }
                        break;

                    case 2: // Phone number input
                        const cleanPhone = finalTranscript.replace(/\s/g, '');
                        if (!validatePhoneNumber(cleanPhone)) {
                            showError('Please provide a valid phone number.');
                            currentStep--;
                        } else {
                            userData.phone = cleanPhone;
                        }
                        break;

                    case 3: // Booking confirmation
                        const bookingResponse = finalTranscript.toLowerCase();
                        userData.bookingOpinion = bookingResponse;
                        
                        if (bookingResponse.includes('no') || bookingResponse.includes('नहीं') || bookingResponse.includes('না')) {
                            const thankYouMessage = language === 'hi-IN' 
                                ? 'ठीक है, आपका दिन शुभ हो!'
                                : language === 'bn-BD'
                                ? 'ঠিক আছে, আপনার দিন শুভ হোক!'
                                : 'Okay, have a nice day!';
                            showBotMessage(thankYouMessage);
                            stopRecognition();
                            return;
                        }
                        break;

                    case 4: // Show selection
                        const showIndex = parseInt(finalTranscript) - 1;
                        if (isNaN(showIndex) || showIndex < 0 || showIndex >= shows.length) {
                            showError('Invalid show number. Please provide a number between 1 and ' + shows.length);
                            currentStep--;
                        } else {
                            userData.showName = shows[showIndex].name;
                            userData.showPrice = shows[showIndex].price;
                        }
                        break;

                    case 5: // Ticket quantity
                        const ticketCount = parseInt(finalTranscript);
                        if (isNaN(ticketCount) || ticketCount <= 0 || ticketCount > 10) {
                            showError('Please provide a valid number of tickets (1-10).');
                            currentStep--;
                        } else {
                            userData.ticketCount = ticketCount;
                            userData.totalPrice = userData.showPrice * userData.ticketCount;
                            
                            const priceMessage = language === 'hi-IN'
                                ? `${userData.showName} के लिए ${userData.ticketCount} टिकटों की कुल कीमत ${userData.totalPrice} रुपये है। क्या आप भुगतान करना चाहते हैं?`
                                : language === 'bn-BD'
                                ? `${userData.showName} এর জন্য ${userData.ticketCount}টি টিকিটের মোট মূল্য ${userData.totalPrice} টাকা। আপনি কি পেমেন্ট করতে চান?`
                                : `The total price for ${userData.ticketCount} tickets to ${userData.showName} is ₹${userData.totalPrice}. Do you want to proceed with the payment?`;
                            
                            showBotMessage(priceMessage);
                            
                            // Create payment button
                            const paymentBtn = document.createElement('button');
                            paymentBtn.textContent = language === 'hi-IN' ? 'भुगतान करें' 
                                : language === 'bn-BD' ? 'পেমেন্ট করুন' 
                                : 'Proceed to Payment';
                            paymentBtn.className = 'btn payment-btn';
                            paymentBtn.style.margin = '10px 0';
                            
                            paymentBtn.addEventListener('click', () => {
                                // Store booking data for payment page
                                sessionStorage.setItem('bookingData', JSON.stringify(userData));
                                window.location.href = 'pay.html';
                            });
                            
                            chatLog.appendChild(paymentBtn);
                            stopRecognition();
                            return;
                        }
                        break;

                    default:
                        console.warn('Unexpected conversation step:', currentStep);
                        break;
                }

                // Move to next step if no errors
                if (currentStep > 0) {
                    nextStep();
                }

            } catch (error) {
                console.error('Error processing speech result:', error);
                showError('Error processing your input. Please try again.');
            }
        };

        // Event listeners for control buttons
        startBtn.addEventListener('click', () => {
            try {
                // Reset conversation state
                currentStep = 0;
                userData = {
                    name: '', phone: '', bookingOpinion: '',
                    showName: '', showPrice: 0, ticketCount: 0, totalPrice: 0
                };
                
                // Clear previous payment buttons
                const existingPaymentBtn = chatLog.querySelector('.payment-btn');
                if (existingPaymentBtn) {
                    existingPaymentBtn.remove();
                }
                
                nextStep(); // Start conversation
                recognition.lang = language;
                recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                showError('Failed to start voice recognition. Please try again.');
            }
        });

        stopBtn.addEventListener('click', () => {
            stopRecognition();
        });

        // Language selection handlers
        const selectLanguage = (lang, confirmMessage) => {
            if (isRecognitionActive) {
                stopRecognition();
            }
            language = lang;
            showBotMessage(confirmMessage);
            
            // Update button visual feedback
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        };

        enBtn.addEventListener('click', (event) => {
            selectLanguage('en-US', 'You have selected English. Click Start to begin booking.');
        });

        hiBtn.addEventListener('click', (event) => {
            selectLanguage('hi-IN', 'आपने हिंदी चुनी है। बुकिंग शुरू करने के लिए Start दबाएं।');
        });

        bnBtn.addEventListener('click', (event) => {
            selectLanguage('bn-BD', 'আপনি বাংলা নির্বাচন করেছেন। বুকিং শুরু করতে Start চাপুন।');
        });
    }

    // Initialize with welcome message
    showBotMessage('Welcome to the Museum Ticket Booking System! Please select your language and click Start to begin.');
    
    // Set default language button as active
    enBtn.classList.add('active');
});

// Add CSS for active language button
const style = document.createElement('style');
style.textContent = `
    .lang-btn.active {
        background-color: #28a745 !important;
        color: white !important;
    }
    .payment-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    .payment-btn:hover {
        background-color: #0056b3;
    }
`;
document.head.appendChild(style);























