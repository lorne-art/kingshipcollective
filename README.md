# Kingship Collective — Website

A static site (no build step) for Kingship Collective, ready to upload to Hostinger.

## Files

```
index.html          Home
services.html        Commercial Sales / Residential / Consulting
about.html            Mission, stats, managing partners
contact.html          Contact form + office info + map
assets/css/style.css  All styling (brand colors/fonts as CSS variables at the top)
assets/js/main.js     Nav, scroll reveal, animated counters, contact form submit
assets/images/        logo-mark.svg, skyline.svg (placeholder brand art — see below)
```

## 1. Deploy to Hostinger

1. Log in to **hPanel** → **Websites** → your domain → **File Manager** (or connect via FTP with the credentials under **Websites → Manage → FTP Accounts**).
2. Open `public_html` (this is your site's web root).
3. Upload every file and folder from this project **into** `public_html`, keeping the folder structure (`assets/css/...`, `assets/js/...`, `assets/images/...` must stay alongside the `.html` files).
4. Visit your domain — `index.html` loads automatically as the homepage.

No PHP, Node, or database is required — it's plain HTML/CSS/JS, so any Hostinger plan works.

## 2. Contact form — already set up

The contact form on `contact.html` posts to **[Web3Forms](https://web3forms.com)**, a free service built for static sites (250 free submissions/month, no backend needed). The access key is already wired in and delivers submissions to Lorne's email.

If you ever need to change which email receives submissions, go to https://web3forms.com, generate a new Access Key for the new address, and swap it into this line near the top of the form in `contact.html`:
```html
<input type="hidden" name="access_key" value="2b19eb0d-e911-4d90-bcbb-919f13aad0d6">
```

Until you do this, the form will show a friendly error asking visitors to email you directly — it won't silently fail.

## 3. Swap in real photos and bios

The real logo is already wired in (`assets/images/logo-mark.webp`, used in every nav/footer, plus `assets/images/favicon.png` as the browser tab icon). What's still a placeholder:

| Placeholder | Where | Replace with |
|---|---|---|
| Team monogram circles (LO / KF / GM) | `.avatar` divs in `index.html` and `about.html` | Real headshots. Replace `<div class="avatar">LO</div>` with `<img class="avatar" src="assets/images/lorne.jpg" alt="Lorne Ottinger">` (add `object-fit:cover` if needed — already handled by the `.avatar` aspect-ratio box). |
| Facebook/Instagram/LinkedIn links | `href="#"` in every page's footer | Your real profile URLs. |

If you ever update the logo again, replace `assets/images/logo-mark.webp` (used at nav/footer size) and regenerate `favicon.png` from it (a 180×180 PNG works well for browser tabs).

### Hero/section photography (AI-generated, slots already wired)

Three photo slots are already wired into the CSS and will appear automatically the moment you drop a matching file into `assets/images/` — no other code changes needed. Until then, each one gracefully falls back to its current look (a plain gradient for the hero, the surrounding brand-color wash for the two services photos), so nothing looks broken in the meantime.

| File to add | Used on | Recommended size |
|---|---|---|
| `assets/images/hero-charleston.jpg` | `index.html` hero background (behind the headline) | 2400×1350px min (16:9), compressed `.jpg`/`.webp` under ~400KB |
| `assets/images/hero-development.jpg` | `services.html` — Commercial Sales section | 1600×1280px (5:4 crop-safe) |
| `assets/images/hero-architectural.jpg` | `services.html` — Residential Real Estate section | 1600×1280px (5:4 crop-safe) |

The descriptive captions for the two services photos are already baked into the HTML as `aria-label`s (for screen readers, since CSS background images have no `alt` text) — no need to add anything else when you drop the files in.

## 4. Editing copy

There's no CMS — text lives directly in the HTML files. Search for the section you want (e.g. open `about.html` and search for "Meet the Managing Partners") and edit the text between tags directly. Each of the 4 pages repeats the same header/footer markup, so if you change the address, phone numbers, or nav links, update all 4 files (`index.html`, `services.html`, `about.html`, `contact.html`) the same way.

## 5. Notes on fonts & animation

- Typography uses **General Sans** (Fontshare, free for commercial use) as a stand-in for Neue Haas Grotesk, which requires a paid license. Loaded via CDN — no local font files to manage.
- Scroll animations use **GSAP + ScrollTrigger** via CDN, with a plain CSS fallback so content is never invisible if JavaScript fails to load. Everything respects `prefers-reduced-motion`.

## 6. What to test before launch

- Fill out and submit the contact form once you've added your Web3Forms key.
- Click through Home → Services → About → Contact on a phone-sized browser window and check the hamburger menu.
- Update the social links so the footer icons don't point at `#`.
