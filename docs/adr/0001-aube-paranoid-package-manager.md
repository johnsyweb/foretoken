---
status: accepted
---

# aube with paranoid mode for package management

This repo already used native `aube-lock.yaml`, but toolchain pins were `latest`, lifecycle policy lived under `package.json`, and every install ran Playwright browser download via `postinstall`. That made frozen CI installs heavy and left no explicit seven-day cooling aligned with Renovate.

## Decision

1. **aube as the sole npm package manager** — keep `aube-lock.yaml`; no `pnpm-lock.yaml` / `package-lock.json`.
2. **`paranoid: true`** in `aube-workspace.yaml` — jailed builds, strict store integrity, and a seven-day minimum release age (aligned with Renovate; see ADR 0002).
3. **Explicit build approval** — lifecycle scripts run only when listed in `allowBuilds` (`esbuild`, `unrs-resolver`).
4. **Version pinning** — `aube` in `mise.toml`, matching `packageManager` in `package.json`, and `packageManagerStrictVersion: true`.
5. **Playwright browsers are opt-in** — no `postinstall` browser download; install Chromium explicitly before build / asset generation (`aube exec playwright install chromium`, CI build job, or `./script/cibuild`).
6. **CVE audit in CI verify** — `aube audit --audit-level moderate --ignore-unfixable` via `./script/audit` and `./script/cibuild`.
7. **Local tasks** — `mise run ci-install` / `update-deps` / `cibuild` for contributor and Renovate verify flows.
8. **Trust-policy escape hatch** — `trustPolicyExclude` lists a narrow `chromium-bidi@…` pin when Playwright resolution selects a release without trusted-publisher evidence.
9. **Security overrides** — `minimatch` and `glob` pinned above advisory ranges, with matching `minimumReleaseAgeExclude` until they age past the seven-day gate.

## Considered options

**Keep postinstall Playwright download (rejected)** — slows every install and Renovate lock regen; browsers are only needed for icon/OG generation and production build.

**aube without paranoid mode (rejected)** — weaker protection against freshly published malicious packages and unreviewed lifecycle scripts.

## Consequences

- Contributors run `aube exec playwright install chromium` once (or whenever browsers are missing) before local builds that need icons.
- New dependencies with lifecycle scripts need an explicit `allowBuilds` entry before CI passes.
