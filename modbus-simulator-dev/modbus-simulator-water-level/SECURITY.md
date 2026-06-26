# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within the Modbus TCP Multi-Sensor Simulator, please send an email to  tunasakar[at]pm.me. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Type of vulnerability
- Full path of the affected source file
- Location of the affected code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Considerations

### WebSocket Security
- WebSocket connections are only accepted from the same origin
- All data transmitted via WebSocket is validated and sanitized
- Invalid messages are logged and connections are terminated if necessary

### Input Validation
- All Modbus parameters are validated against predefined ranges
- Function codes are restricted to supported values


### Data Safety
- No sensitive data is stored or transmitted
- All data is ephemeral and exists only in memory
- No permanent storage is implemented


### Network Security
- Only required ports are exposed

### Best Practices
1. Keep all dependencies up to date
2. Use the latest stable version of Node.js
3. Monitor GitHub security advisories
4. Follow secure coding guidelines
5. Implement proper error handling
6. Use strong input validation
7. Maintain secure configurations

## Version Support

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Updates

Security updates will be released as soon as possible after a vulnerability is discovered and verified. Updates will be published as new releases on GitHub and will include detailed changelogs.

## Development Security Guidelines

When contributing to this project, please ensure:

1. No sensitive information is logged
2. All user input is validated and sanitized
3. Error messages don't reveal system information
4. Dependencies are kept up to date
5. Code follows secure coding practices
6. Tests include security-focused scenarios
7. Documentation includes security considerations

## Deployment Security

When deploying this application:

1. Use HTTPS in production
2. Configure proper CORS headers
3. Implement rate limiting
4. Monitor WebSocket connections
5. Set up proper logging
6. Use secure WebSocket (wss://) in production
7. Configure proper firewall rules

## Contact

For security-related inquiries, contact:
- Email: tunasakar[at]pm.me