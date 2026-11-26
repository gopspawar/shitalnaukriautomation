# Naukri Profile Automation 🚀

An automated QA project built with Playwright, TypeScript, and Node.js to refresh selected Naukri profile details.

## Project Overview

The Playwright test signs in to Naukri, downloads the current resume, saves it with the profile display name and current day/month in its filename, uploads it back to the profile, updates the resume headline, verifies the changes, and signs out.

## Features

- Automated Naukri login and logout
- Resume download, date-stamped rename, and upload
- Resume headline update and verification
- Profile display name included in the resume filename
- Playwright HTML report
- Screenshot, trace, and video capture on test failure
- Test retry configured
- Credentials loaded from environment variables

## Tech Stack

| Technology | Purpose |
|---|---|
| Playwright Test | Browser automation and test execution |
| TypeScript | Test implementation |
| Node.js and npm | Runtime and package management |

## Project Structure

```text
naukri-automation/
├── tests/
│   └── naukri-login.spec.ts
├── downloads/             # Downloaded resume; ignored by Git
├── playwright-report/     # Generated HTML report
├── test-results/          # Generated test artifacts
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .env                   # Local credentials; do not commit
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- A Naukri account
- Chromium for Playwright

## Installation

Install dependencies and the Chromium browser:

```bash
npm install
npx playwright install chromium
```

## Environment Configuration

Create a `.env` file in the project root:

```dotenv
NAUKRI_USERNAME=your-email-or-username
NAUKRI_PASSWORD=your-password
```

Never commit actual credentials or the `.env` file.

## Run Tests

Run the test:

```bash
npm test
```

The configured browser runs in headed mode. The downloaded PDF is saved under `downloads/` with a name like `shital_Daberao_26Nov.pdf`. Naukri's supported file types and size limits apply.

**This test updates your Naukri profile.** Run it only when you intend to upload the resume and update the headline.

## Test Reports

Open the generated Playwright HTML report:

```bash
npm run test:report
```

Reports are written to `playwright-report/`; failure artifacts are written to `test-results/`.

## Future Enhancements

- Profile skills updates with duplicate prevention
- Reusable Page Object Model
- Before-and-after screenshots for successful runs
- CI/CD integration
- Additional profile-update test scenarios

## Author

**Gopal Pawar**  
QA Automation Engineer | Playwright | TypeScript | Selenium | Java

---

This project is intended for learning and authorized automation. Use responsibly and respect Naukri's terms of service.
