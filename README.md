# Bumpory

**Every week, a little story.**

Android-first pregnancy companion and offline journal. A calm, practical experience for the weeks from a positive test to birth, with personal photos and notes. Future monetization: optional personalized printed keepsake book.

## Current implementation (v0.1 preview)

- Expo SDK 58 / React Native 0.88 / TypeScript / Expo Router.
- Five tabs: Today, Weeks 1–42, Journal, Plan, Help.
- Onboarding using LMP, local-date gestational-age calculation and estimated due date.
- SQLite persistence for the LMP, weekly task progress and journal entries.
- Journal with one photo per entry, edit/delete and offline original-file copy.
- Emergency phone shortcuts for Russian users, with no symptom-based automated diagnosis.
- Original provisional brand tokens and vector concept mark.
- Unit tests for dating logic and 42-week content structure.

**Editorial warning:** All 42 week slots exist but only a handful contain starter copy. All content is marked unreviewed. Do not publish as a verified medical guidance product.

**Privacy warning:** SQLite and local image files are **not encrypted** in this preview, and there is no backup/import flow yet. Do not store irreplaceable personal images in this build. Complete encryption, backup and privacy review before real-user testing.

## Setup

Requirements: Node.js >= 22.13, npm, Android Studio with SDK appropriate for Expo SDK 58, Java 17.

```bash
git clone https://github.com/JohnCook36/bumpory.git
cd bumpory
npm install
npx expo install --check
npm run typecheck
npm test
npx expo start --clear
```

Press `a` to open Android emulator, or use `npx expo run:android` with configured Android SDK. If current Expo Go is not compatible with SDK 58, use a development build.

## Architecture

- `app/` - Expo Router screen routes
- `src/theme/` - design tokens
- `src/domain/` - pure dating business rules
- `src/data/` - SQLite repository, copy of photo files, draft weekly materials
- `src/ui/` - shared components
- `docs/` - design system, architecture, release gates

Read `docs/release-gates.md` before distributing this build.

Project hub: https://app.notion.com/p/418043746cc680bf92d0cd905ed2fcdc

## Boundaries

No medical diagnosis, no drug recommendations, no remote analytics, no accounts or server in the initial preview. A print-book purchase flow is a separate future milestone.
