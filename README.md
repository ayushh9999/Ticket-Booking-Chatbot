# 🎫 AI Ticket Booking Chatbot

[![GitHub license](https://img.shields.io/github/license/ayushh9999/Ticket-Booking-Chatbot)](https://github.com/ayushh9999/Ticket-Booking-Chatbot/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/ayushh9999/Ticket-Booking-Chatbot)](https://github.com/ayushh9999/Ticket-Booking-Chatbot/issues)
[![GitHub stars](https://img.shields.io/github/stars/ayushh9999/Ticket-Booking-Chatbot)](https://github.com/ayushh9999/Ticket-Booking-Chatbot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ayushh9999/Ticket-Booking-Chatbot)](https://github.com/ayushh9999/Ticket-Booking-Chatbot/network)

A sophisticated AI-powered chatbot for museum ticket booking with speech recognition, multilingual support, and integrated payment processing. The chatbot supports voice and text interactions in English, Hindi, and Bengali.

## 🌟 Features

### 🤖 Smart Chatbot Interface
- **Voice Recognition**: Supports speech-to-text for hands-free interaction
- **Multilingual Support**: Available in English, Hindi, and Bengali
- **Interactive Conversation**: Step-by-step guided ticket booking process
- **Real-time Chat**: Dynamic conversation flow with user data collection

### 🎭 Museum Ticket Booking
- **Show Selection**: Multiple shows with different pricing tiers
- **Ticket Quantity**: Flexible ticket booking for multiple visitors
- **Price Calculation**: Automatic total price calculation
- **Booking Confirmation**: Complete booking flow with user details

### 💳 Integrated Payment System
- **UPI Payment**: Secure UPI-based payment processing
- **QR Code Generation**: Dynamic QR codes for easy payments
- **OTP Verification**: SMS-based OTP for ticket confirmation
- **Transaction Tracking**: UTR/Reference ID tracking for payments

### 🌐 Multilingual Support
- **English**: Full feature support
- **Hindi**: Native Hindi language interface
- **Bengali**: Complete Bengali language support

## 📸 Screenshots

### Main Chatbot Interface
![Chatbot Interface](https://github.com/user-attachments/assets/23c2803a-3cee-4f02-b245-6488eb218780)

### Payment Interface
![Payment Interface](https://github.com/user-attachments/assets/9307f2a4-9da6-47f6-84fe-2dd335779dc4)

## 🚀 Quick Start

### Prerequisites
- Web browser with microphone access for voice features
- Web server (Apache/Nginx) for PHP functionality
- PHP 7.4+ for OTP services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushh9999/Ticket-Booking-Chatbot.git
   cd Ticket-Booking-Chatbot
   ```

2. **Set up web server**
   ```bash
   # For development - Python HTTP server
   python3 -m http.server 8000
   
   # Or use PHP built-in server for full functionality
   php -S localhost:8000
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Grant microphone permissions when prompted for voice features

### Configuration

1. **SMS API Setup** (for OTP functionality)
   - Edit `send_otp.php`
   - Replace `YOUR_SMS_API_KEY` with your actual SMS service API key
   - Update the SMS API endpoint URL

2. **Payment Configuration**
   - Update UPI ID in `payscript.js`
   - Configure payment amounts as needed

## 🏗️ Project Structure

```
Ticket-Booking-Chatbot/
├── index.html          # Main chatbot interface
├── pay.html           # Payment processing page
├── script.js          # Core chatbot logic and speech recognition
├── styles.css         # Main interface styling
├── payscript.js       # Payment processing logic
├── paystyles.css      # Payment interface styling
├── send_otp.php       # OTP generation and SMS sending
└── README.md          # Project documentation
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Speech Recognition**: Web Speech API
- **Payment**: UPI integration with QR codes
- **Backend**: PHP for OTP services
- **APIs**: SMS API for OTP delivery, QR Code generation API

## 🎯 Usage Guide

### Starting a Conversation

1. **Select Language**: Choose from English, Hindi, or Bengali
2. **Begin Chat**: Click the "Start" button or use voice command
3. **Provide Details**: Follow the prompts to enter:
   - Your name
   - Phone number
   - Booking preferences

### Booking Process

1. **Show Selection**: Choose from available museum shows
2. **Ticket Quantity**: Specify number of tickets
3. **Price Confirmation**: Review total cost
4. **Payment**: Proceed to secure payment

### Payment Flow

1. **Enter Details**: Provide name, phone, and email
2. **Generate QR**: Click "NEXT" to generate payment QR code
3. **Pay via UPI**: Scan QR code with any UPI app
4. **Confirm Payment**: Enter UTR/Transaction ID
5. **Receive Ticket**: Get OTP confirmation as digital ticket

## 🔧 API Reference

### Speech Recognition
The chatbot uses the Web Speech API for voice recognition:
```javascript
const recognition = new webkitSpeechRecognition();
recognition.lang = language; // 'en-US', 'hi-IN', 'bn-BD'
```

### Payment QR Generation
QR codes are generated using the QR Server API:
```javascript
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiLink}`;
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development setup
- Pull request process
- Coding standards

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: [Create an issue](https://github.com/ayushh9999/Ticket-Booking-Chatbot/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a feature](https://github.com/ayushh9999/Ticket-Booking-Chatbot/issues/new?template=feature_request.md)

## 🔐 Security

For security concerns, please email: [security@example.com]

## 📊 Project Stats

- **Languages**: JavaScript, PHP, HTML, CSS
- **License**: MIT
- **Status**: Active Development

## 🙏 Acknowledgments

- Web Speech API for voice recognition capabilities
- QR Server API for QR code generation
- SMS service providers for OTP delivery
- Open source community for inspiration and support

---

**Made with ❤️ for seamless museum ticket booking experience**
