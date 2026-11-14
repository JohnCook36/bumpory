# Bumpory – Release Gates

## Preview v0.1
- [x] Local-only app architecture and five-route navigation
- [x] SQLite profile, journal and tasks implementation
- [x] ImagePicker plus local original-image file copy
- [x] LMP calculation with timezone-safe pure date functions and unit tests
- [x] Russian emergency call shortcuts with disclaimer
- [ ] Confirm Android compile and UI smoke run on emulator (not yet executed)
- [ ] Verify photo operations after app background/foreground and upgrades
- [ ] Add release icon images and accessibility QA

## Blocking public distribution
- [ ] Independent clinician review and source/version tracking for all medical information.
- [ ] Complete 42-week content; mark approved vs draft in authoring workflow.
- [ ] Encrypt sensitive journal content and original photos; secure key lifecycle.
- [ ] Implement offline export/import; test restoring into a fresh installation.
- [ ] Clear consent, privacy notice, local data deletion, pregnancy loss/end-of-journey UX.
- [ ] Validate contacts per user's country and prevent misdirected emergency calls.
- [ ] Decide clinical device regulatory classification if future symptom checks introduced.
- [ ] Regulatory and accessibility review, privacy testing, store policy compliance.
- [ ] Pin and verify dependency versions with lockfile; run all CI and Android tests.

## Future milestones
- Notification scheduling, calendar appointments, doctor contact storage.
- Optional encrypted sync and family sharing after explicit user consent.
- Voluntary print-book export and ordering with data minimization.
