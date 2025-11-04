# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### Added
- Barcode generation for parkrun finish tokens (P#### format) as scannable 1D barcodes
- QR code support (2D barcode format) with toggle between 1D and QR code modes
- Mobile-optimised interface with swipe gestures for navigation
- Direct position entry by tapping the token number
- URL parameter support (`?position=42`) for direct navigation and sharing
- Print sheet functionality for preparing replacement finish tokens in advance when large attendance is anticipated
  - A4 format (52 tokens per page) or Letter format (48 tokens per page) based on locale
  - 40mm x 20mm tokens with 1D barcode and token number label
- Personal barcode storage with ICE (In Case of Emergency) details
  - Credit-card sized format (85.6mm × 53.98mm proportions)
  - Save and display personal parkrun barcode and emergency contact information
  - Download as image or add to Apple Wallet
- Full keyboard accessibility
  - Arrow key navigation (← decreases position, → increases position)
  - Enter key support for form submission
  - Escape key to close modals
  - Tab navigation throughout the interface
- parkrun colour palette (aubergine and apricot) for familiarity

### Fixed
- QR code overflow on mobile devices
- Arrow key navigation direction (left decreases, right increases)
- Print layout issues on mobile Safari
- Print margin and token readability improvements

### Changed
- Monospaced text now uses Atkinson Hyperlegible Mono font
- Personal barcode card proportions match printed parkrun barcodes (credit-card sized)
- Print sheet rendering uses new window approach for better cross-platform compatibility

### Documentation
- Comprehensive README with feature descriptions
- About box with usage instructions
- Keyboard navigation documented
- Print feature use case clarified for large attendance events

[1.0.0]: https://github.com/johnsyweb/foretoken/compare/v1.0.0...v1.0.0
