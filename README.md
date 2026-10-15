# HYDRA Blacksite

**A blacksite-themed Capture the Flag web challenge created for a CTF event at Microsoft Innovations Club.**

Built by [Kushal](https://github.com/kushalapril2006-art), HYDRA Blacksite places participants inside a fictional operative-access system. The challenge combines web reconnaissance, authentication, API exploration, and encoded artifacts in a connected investigation.

This README covers the project and deployment without revealing credentials, flags, or the solution.

## Highlights

- **Themed challenge experience:** a browser interface and supporting artifacts built around the HYDRA Blacksite scenario.
- **Connected investigation:** participants examine web responses, discover clues, and explore the challenge's interfaces.
- **Server-side challenge routing:** a bundled runtime handles pages, assets, authentication, APIs, and downloadable artifacts.
- **Human verification:** Cloudflare Turnstile sits in front of site routes, including challenge files and APIs.
- **Signed access sessions:** successful perimeter verification issues a signed, one-hour browser cookie.
- **Netlify deployment:** a global Edge Function passes incoming requests to the challenge runtime.

## Technology

| Component | Technology |
| --- | --- |
| Application runtime | JavaScript ES modules using Web Request/Response APIs |
| Hosting and request routing | Netlify Edge Functions |
| Human verification | Cloudflare Turnstile |
| Cookie signing | Web Crypto API with HMAC-SHA-256 |
| Frontend delivery | Prebuilt HTML, JavaScript, CSS, fonts, and image assets embedded in the runtime |

## Repository structure

```text
hydra_blacksite/
├── netlify/
│   └── edge-functions/
│       └── ctf-gate.js      # Netlify adapter and environment-variable mapping
├── public/
│   └── index.html          # Fallback page when the edge handler is unavailable
├── runtime/
│   └── server/
│       └── index.js        # Prebuilt challenge runtime and embedded assets
├── netlify.toml            # Publish directory and global edge routing
├── package.json            # ES module configuration and build placeholder
└── TURNSTILE-SETUP.txt      # Verification setup and expected access checks
```

The challenge is served by the runtime, rather than directly from `public/`. The public directory deliberately contains only a fallback page.

## Request flow

1. Netlify routes the incoming request through `ctf-gate`.
2. The runtime checks for a valid signed Turnstile access cookie.
3. Visitors without access receive a human-verification page.
4. Successful verification grants one hour of perimeter access.
5. The runtime then serves the requested challenge route. Challenge authentication remains a separate step for protected APIs and downloads.

## Deployment

### Prerequisites

- A Netlify site connected to this repository.
- A Cloudflare Turnstile widget configured for the deployment hostname.
- The environment variables below configured in Netlify with **Functions** scope.

| Variable | Purpose |
| --- | --- |
| `TURNSTILE_SITE_KEY` | Turnstile widget site key |
| `TURNSTILE_SECRET_KEY` | Secret used for server-side Turnstile verification |
| `TURNSTILE_COOKIE_SECRET` | Secret used to sign perimeter-access cookies |

Keep secret values in the hosting environment rather than committing them to the repository.

### Deploy on Netlify

1. Import this repository into Netlify.
2. Use `npm run build` as the build command and `public` as the publish directory.
3. Add all three environment variables.
4. Deploy the site, or trigger a fresh deploy after changing the variables.
5. Confirm that the `ctf-gate` Edge Function handles `/*`.

The build command only prints a message confirming use of the prebuilt bundle. It does **not** compile frontend source or regenerate `runtime/server/index.js`. This repository contains the deployment bundle rather than an editable frontend source project.

Opening `public/index.html` directly will show the fallback page, not the challenge. Use the Netlify deployment to access the complete application.

### Verify the deployment

With all variables configured, check the following behavior:

| Check | Expected result |
| --- | --- |
| Anonymous request to the homepage or a challenge-file route | Turnstile gate with HTTP 403 |
| Invalid verification submission | HTTP 403 |
| Successful verification | Signed HttpOnly cookie and redirect |
| Verified browser requesting a challenge route | Intended challenge response |
| Protected API request without a challenge session | HTTP 401 |
| Modified or expired perimeter cookie | Turnstile gate |

See [TURNSTILE-SETUP.txt](TURNSTILE-SETUP.txt) for the original deployment checklist.

## Event context

Created for a **Capture the Flag event at Microsoft Innovations Club**. The challenge is intended for cybersecurity learning and event participation within the designated challenge environment.

Flags, challenge credentials, and solution walkthroughs are intentionally omitted from this document.
