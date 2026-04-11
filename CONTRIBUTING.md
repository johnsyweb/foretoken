# Contributing to Foretoken

Thank you for your interest in contributing to Foretoken.

## Reporting Issues

If you find a bug or have an idea, please open a GitHub issue with as much context as possible.

Helpful details include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Device and browser details
- Whether this happened during live event use, setup, or testing
- Screenshots or links (if available)

## Submitting Changes

1. Fork the repository and create a feature branch.
2. Make focused changes (one concern per pull request where possible).
3. Run checks locally.
4. Open a pull request with a clear description and any relevant issue links.

## Local Quality Checks

Please run these before opening a pull request:

```bash
pnpm run type-check
pnpm run lint
pnpm run format:check
pnpm test
```

## Pull Request Guidelines

- Keep PRs small and purpose-driven.
- Describe user impact, not only code changes.
- Update docs when behavior or workflows change.
- Include tests for behavior changes where practical.

## Usage Stories

We welcome usage stories at [foretoken@johnsy.com](mailto:foretoken@johnsy.com).

When you share a story, please include:

- Event/date (or approximate timeframe)
- Operational problem (for example: token shortage)
- How Foretoken was used
- Scale (approximate token count or participants helped)
- Permission to publish (yes/no)
- Anonymization preference (anonymous by default, named credit only with explicit opt-in)
- Optional evidence link (photo, video, post, or report)

### Publication Defaults

- Stories are anonymized by default.
- Named credit is only added with explicit opt-in.
- You can request edits or takedown later by emailing the same address.

## Licensing

By contributing to this repository, you agree that your contributions are provided under the MIT License.
