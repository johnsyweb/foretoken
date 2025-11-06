## [1.2.1](https://github.com/johnsyweb/foretoken/compare/v1.2.0...v1.2.1) (2025-11-06)


### Bug Fixes

* **release:** ensure package.json version is updated by semantic-release and used in build ([08f6c85](https://github.com/johnsyweb/foretoken/commit/08f6c85a7b5a734a92ae700d87cef7f0b498c1f3))

# [1.2.0](https://github.com/johnsyweb/foretoken/compare/v1.1.0...v1.2.0) (2025-11-06)


### Features

* **app:** persist barcode type via code query param and sync across UI ([f741bbb](https://github.com/johnsyweb/foretoken/commit/f741bbbb26da5dfefaa03f90c0fb37e8e9cfc535))

# [1.1.0](https://github.com/johnsyweb/foretoken/compare/v1.0.0...v1.1.0) (2025-11-06)


### Features

* **personal-barcode:** add QR option and enrich shared details in message ([271adae](https://github.com/johnsyweb/foretoken/commit/271adae3b62bfb4788bb20b36d3697e46a1829e8))

# 1.0.0 (2025-11-05)


### Bug Fixes

* correct arrow key navigation direction ([f5787a2](https://github.com/johnsyweb/foretoken/commit/f5787a2273c0104d924687c0fbfe5d3c29faca1f))
* improve print layout and token readability ([700f195](https://github.com/johnsyweb/foretoken/commit/700f195361c4cf78adbd33a79e405bf1ef37de94))
* prevent QR code overflow on mobile devices ([8b6b3c9](https://github.com/johnsyweb/foretoken/commit/8b6b3c9a24b9a13a055d3f5827892b49d9c2685d))
* reduce top margin and prevent print overflow ([2cff1dc](https://github.com/johnsyweb/foretoken/commit/2cff1dcc5bcf8a9662f029719cf1f0e055d3362d))


### Features

* add print sheet functionality for finish tokens ([3336d2d](https://github.com/johnsyweb/foretoken/commit/3336d2deb53fb21ff4dc975b2ab7f48f43e7616c))
* add PWA support and home screen installation instructions ([e5e16b5](https://github.com/johnsyweb/foretoken/commit/e5e16b5d13b4d664a2cdc945aa8ba8f60aeba6c4))
* add semantic versioning with automated changelog and release ([95048e5](https://github.com/johnsyweb/foretoken/commit/95048e5cbb342c76611da44cd118840e54368c1b))
* enable Enter key to submit Personal Barcode form ([cc6ce4c](https://github.com/johnsyweb/foretoken/commit/cc6ce4cb33a3b9a150d92fdb93fe5952e6690897))
* make personal barcode card credit card sized ([549ff48](https://github.com/johnsyweb/foretoken/commit/549ff4875ae2fcac4dbb981121c8b54ce48eba52))
* reformat personal barcode modal layout and add keyboard navigation ([854cd85](https://github.com/johnsyweb/foretoken/commit/854cd8596817ad1938cf8f0d89584e3ba1a93d3c))
* show barcode view after saving personal barcode ([3a34556](https://github.com/johnsyweb/foretoken/commit/3a34556ec5e07c792d909fef941a6d65d74e3264))

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
