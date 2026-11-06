# TechBridge Homepage

> **Bridging Learning to Real-World Experience**

Hi, I'm **Chuks Official**, a web developer and frontend designer. This is my submission for **Task 1** of the TechBridge Web Development Internship: designing and building the homepage for **TechBridge by Baselink Services Limited**.

- **Live website:** _add your live link here_
- **Repository:** _add your GitHub link here_

![TechBridge homepage screenshot](images/screenshot.png)
_Add a screenshot of the finished homepage as `images/screenshot.png`._

---

## What this project is

TechBridge is preparing to establish its online presence, and it needed a homepage that introduces the organization to potential interns and learners. I built a small website of four linked pages that helps a first-time visitor quickly understand:

- **What TechBridge is:** an organization that helps people move from studying technology to practising it
- **What it offers:** the **Data Analytics** and **Web Development** programs, and a **30-Day Practical Internship**
- **Who it is for:** learners and aspiring interns
- **Why they might join:** practical, project-based work, and the possibility of a recommendation letter based on successful participation and performance
- **How to apply:** through the official TechBridge Internship Application Form
- **How to join the community:** through the TechBridge WhatsApp Community

The brief asked for a site that feels like a real organization's, not a classroom exercise, so that was my goal throughout.

## My design idea

**The bridge.** TechBridge's name and tagline are about connecting two sides: learning on one side, real-world experience on the other. I used that as the main idea of the site.

- The hero shows a bridge drawn as circuit traces, a nod to the circuit mark in the official TechBridge logo. It draws itself when the page loads.
- The About section shows "Learning" and "Real-world experience" as two banks joined by a bridge.
- The 30-day internship section lays 30 planks across, one for each day, as you scroll to it.

**Colours and type.** I took the palette straight from the official logo: deep indigo (`#0D004D`) and green (`#39B80A`), on clean white. I paired a classic serif (Newsreader) for headings with a clean sans-serif (Figtree) for body text, so the site feels professional and trustworthy rather than flashy.

## The pages

| Page | What it does |
|---|---|
| `index.html` | The homepage: hero, about, programs, 30-day internship, key facts, why join, how to apply, community, FAQ, contact |
| `programs.html` | **Task 2:** the dedicated Programs experience, with an overview, a "which sounds more like you?" picker, a full section and skills for each program, a filter, a side-by-side comparison and an apply call to action |
| `apply.html` | A short three-step page to prepare your details before applying. It leads to the official form |
| `community.html` | Explains the WhatsApp community and has the join button |
| `contact.html` | The official contact channels, plus a message form that opens the visitor's email app |

## Features

**Content and navigation**
- Clear navigation with links between all pages, and a header that stays in view as you scroll
- Key facts block, "Why join TechBridge" section, and an FAQ that opens and closes smoothly
- A scroll story, *Learn, Practise, Prove*, where the bridge builds itself as you scroll, and a downloadable one-page info sheet (PDF)
- Quick jump menu (press Ctrl+K), original circuit-style program illustrations, and a time-aware greeting
- Installable as an app with offline support, and an application page that keeps your details on your device until you submit or clear them
- Program detail popups, an announcement bar linking to the official form, and a closing call-to-action banner
- Official email, LinkedIn and Facebook links, with Font Awesome icons

**Motion and interaction**
- Scroll progress bar, sections that reveal as you scroll, and a back-to-top button
- Animated bridge illustration, the "30 days" counter, and cards that tilt toward the cursor
- A page loader on first visit and smooth transitions between pages
- A confetti moment when you finish the application preparation steps
- All animation switches off for visitors who have "reduce motion" turned on in their device settings

**Responsive and accessible**
- Works on desktop, tablet and mobile, with a mobile menu and a mobile "Apply" bar
- Skip-to-content link, visible keyboard focus, semantic HTML and labelled buttons and icons

## Content rules I followed

The brief was clear that I should only use official information, so I did not invent:

- fake testimonials, partners, staff or statistics
- social media accounts, locations or achievements
- extra programs

Where the brief does not give a detail (such as start dates or eligibility), the site says **"Confirm with TechBridge"** instead of guessing. I also built sections for testimonials and partners that stay hidden until real, approved items are added (see below).

The form on `apply.html` only helps visitors prepare. It does **not** send or save anything. Real applications go through the official form.

## Built with

- **HTML5** for structure
- **CSS3** for layout and design, using custom properties, grid, flexbox, keyframe animations and media queries
- **Vanilla JavaScript** (`script.js`) for scroll effects, the FAQ, popups and form checks. I used no frameworks, because a well-built HTML and CSS site is better than a complicated one
- **Font Awesome** for icons and **Google Fonts** for typography

## Project structure

```
techbridge-task-1/
├── index.html
├── programs.html
├── apply.html
├── community.html
├── contact.html
├── style.css
├── script.js
├── data.js
├── sw.js
├── manifest.webmanifest
├── TESTING.md
├── techbridge-info-sheet.pdf
├── README.md
└── images/
    ├── logo.png
    ├── logo-white.png
    ├── favicon.png
    ├── icon-192.png
    ├── icon-512.png
    └── bridge.svg
```

## How to run it

There is nothing to install or build.

1. Download or clone this repository.
2. Open `index.html` in your browser.

An internet connection is needed to load the fonts and icons.

## Updating the content

- **Key facts:** the *Start dates* and *Eligibility details* rows currently say "Confirm with TechBridge". I will replace them in `index.html` only with details TechBridge confirms.
- **Testimonials and partners:** these are controlled from `data.js`. I will add items there only with written permission, and each one needs `approved: true` to appear. While the lists are empty, those sections stay hidden.

## Deployment

I hosted the site for free so reviewers can open it without downloading anything.

- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` → `/ (root)`
- **Vercel:** import the repository and deploy with the default settings (no build command)

## What I learned

Building this taught me how to turn a brand's idea into a visual concept, and how to use the logo to guide colour and style choices. I practised building a mobile menu with CSS only, adding scroll animations that respect accessibility settings, and validating a multi-step form. The main challenge was making the site feel distinctive and professional while using only the official information from the brief.

## Official links

- Application: [TechBridge Internship Application Form](https://forms.gle/8EbdSy5ttGfLZfjv5)
- Community: [TechBridge WhatsApp Community](https://chat.whatsapp.com/FqpBvYS4oaK32cXDxc8JIS)
- Email: techbridgebaslink@gmail.com
- LinkedIn: https://www.linkedin.com/company/techbridge-services/
- Facebook: https://www.facebook.com/p/Baselink-Services-100066771475783/

## About me

I'm **Chuks Official**, a web developer and frontend designer. Thank you for taking the time to look at my work.

&copy; 2026 TechBridge by Baselink Services Limited. All rights reserved.
