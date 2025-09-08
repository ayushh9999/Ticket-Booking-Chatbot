# Contributing to AI Ticket Booking Chatbot

Thank you for your interest in contributing to the AI Ticket Booking Chatbot! We welcome contributions from the community and are pleased to have you aboard.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Exercise empathy and kindness
- Focus on what is best for the community
- Accept constructive criticism gracefully
- Show courtesy and respect towards other community members

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Ticket-Booking-Chatbot.git
   cd Ticket-Booking-Chatbot
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Prerequisites
- Web browser with microphone support
- PHP 7.4+ (for OTP functionality)
- Text editor or IDE
- Git

### Local Development
```bash
# Start local development server
python3 -m http.server 8000

# Or for PHP functionality
php -S localhost:8000
```

## 🤝 How to Contribute

### Types of Contributions

- **Bug Fixes**: Fix existing bugs or issues
- **New Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Code Quality**: Refactor code, add tests, improve performance
- **UI/UX**: Enhance user interface and experience

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Create an issue** for major changes to discuss the approach
3. **Comment on the issue** to let others know you're working on it

## 📝 Pull Request Process

1. **Update documentation** for any new features
2. **Test your changes** thoroughly
3. **Follow coding standards** outlined below
4. **Create a descriptive pull request**:
   - Clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - List any breaking changes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested locally
- [ ] All features working
- [ ] No breaking changes

## Screenshots (if applicable)
Include screenshots for UI changes
```

## 💻 Coding Standards

### JavaScript
- Use ES6+ features when possible
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors gracefully

```javascript
// Good
const generateOtp = (length = 6) => {
  // Generate random OTP of specified length
  return Math.random().toString().slice(2, 2 + length);
};

// Add error handling
try {
  const result = generateOtp();
  console.log('OTP generated:', result);
} catch (error) {
  console.error('Error generating OTP:', error);
}
```

### PHP
- Follow PSR-12 coding standards
- Use meaningful variable names
- Validate all inputs
- Handle errors properly
- Never expose sensitive data

```php
<?php
// Good
function generateSecureOtp(int $length = 6): string {
    if ($length < 4 || $length > 10) {
        throw new InvalidArgumentException('OTP length must be between 4 and 10');
    }
    
    $otp = '';
    for ($i = 0; $i < $length; $i++) {
        $otp .= mt_rand(0, 9);
    }
    
    return $otp;
}
?>
```

### HTML/CSS
- Use semantic HTML5 elements
- Maintain consistent indentation
- Follow BEM methodology for CSS classes
- Ensure accessibility (ARIA labels, proper contrast)
- Mobile-responsive design

```html
<!-- Good -->
<section class="chat-container">
  <div class="chat-container__messages" role="log" aria-live="polite">
    <!-- Chat messages -->
  </div>
  <button class="chat-container__start-btn" aria-label="Start voice chat">
    Start
  </button>
</section>
```

## 🐛 Reporting Issues

### Bug Reports
Use the bug report template and include:
- **Clear description** of the bug
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (browser, OS, etc.)
- **Screenshots** if applicable

### Feature Requests
Use the feature request template and include:
- **Clear description** of the feature
- **Use case** and motivation
- **Proposed solution** or implementation ideas
- **Additional context** or examples

## 🔍 Code Review Process

1. **Automated checks** must pass (if configured)
2. **Manual review** by maintainers
3. **Address feedback** and make necessary changes
4. **Final approval** and merge

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 💡 Development Tips

- **Test in multiple browsers** for compatibility
- **Check mobile responsiveness** on different devices
- **Validate HTML/CSS** using online validators
- **Optimize performance** for better user experience
- **Follow accessibility guidelines** for inclusive design

## 📚 Resources

- [HTML5 Specification](https://html.spec.whatwg.org/)
- [CSS Guidelines](https://cssguidelin.es/)
- [JavaScript Best Practices](https://github.com/airbnb/javascript)
- [PHP Best Practices](https://www.php-fig.org/psr/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎉 Recognition

Contributors will be recognized in:
- **README acknowledgments**
- **Release notes** for significant contributions
- **GitHub contributors** section

Thank you for contributing to making this project better! 🚀

---

*If you have questions, feel free to open an issue or reach out to the maintainers.*