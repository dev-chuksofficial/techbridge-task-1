# TechBridge Homepage

> **Bridging Learning to Real-World Experience**

Hi, I'm **Chuks Official**, a web developer and frontend designer. This is my submission for **Task 1** of the TechBridge Web Development Internship: designing and building the homepage for **TechBridge by Baselink Services Limited**.

- **Live website:** _add your live link here_
- **Repository:** _add your GitHub link here_

![TechBridge homepage screenshot](images/screenshot.png)
_Add a screenshot of the finished homepage as `images/screenshot.png`._

---

## Screenshots

Screenshots of each part of the site are in the `images` folder:

| Part | File |
|---|---|
| Homepage (Task 1) | `images/screenshot.png` |
| Programs page (Task 2) | `images/screenshot-programs.png` |
| Internship Tasks page (Task 3) | `images/screenshot-tasks.png` |
| Roadmap with Data Analytics selected (Task 4) | `images/screenshot-roadmap-data-analytics.png` |
| Roadmap with Web Development selected (Task 4) | `images/screenshot-roadmap-web-development.png` |
| My progress tracker | `images/screenshot-tracker.png` |
| Registration (Task 5) | `images/screenshot-register.png` |
| Task submission (Task 6) | `images/screenshot-submit.png` |
| Dashboard (Task 7) | `images/screenshot-dashboard.png` |
| Intern Portal (Task 8) | `images/screenshot-portal.png` |

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
| `tasks.html` | **Task 3:** the Internship Tasks experience, with all 8 tasks on a roadmap, a 30-day track, difficulty labels, task details, a filter and live status |
| `portal.html` | **Task 8:** the complete Intern Portal hub that connects every part of the internship platform |
| `register.html` | **Task 5:** intern registration and onboarding |
| `roadmap.html` | **Task 4:** the interactive internship roadmap, with a track selector for Data Analytics and Web Development |
| `tracker.html` | My progress tracker (an extra): mark my own tasks and see my progress |
| `submit.html` | **Task 6:** task submission system |
| `dashboard.html` | **Task 7:** intern dashboard |
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
├── tasks.html
├── portal.html
├── register.html
├── roadmap.html
├── tracker.html
├── submit.html
├── dashboard.html
├── portal.js
├── roadmap.js
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

## Task 2: The Programs experience

For Task 2, TechBridge wanted visitors to understand its learning programs more clearly, so I built a dedicated **Programs page** (`programs.html`) on top of my Task 1 website instead of starting a new project. It uses the same logo, navigation, buttons, colours, typography and footer, so it feels like part of the same site.

**What the page includes**
- **Programs overview:** explains that these are practical learning programs, designed to help learners move from learning to real-world experience
- **"Which sounds more like you?":** two contrasting cards that separate the programs at a glance: *Data Analytics* is about working with data and extracting insights, and *Web Development* is about designing and building websites and web applications
- **A full section for each program:** a short description, its one-line focus, and a card for every skill in the brief
  - Data Analytics: spreadsheet analysis, data cleaning, SQL, data visualization, business-focused analysis
  - Web Development: HTML, CSS, JavaScript, Git/GitHub, building web projects
- **Expandable program information:** "What is this program about?", "Who is it for?" and "How do I get started?" open and close under each program
- **Program filtering:** buttons to show all programs, only Data Analytics, or only Web Development
- **Comparison table:** the two programs side by side, which stacks into readable blocks on mobile
- **Call to action:** every "Apply for TechBridge Internship" button opens the official application form, and there is a link back to the homepage
- **Navigation:** the header has Home and Programs links, and the homepage links to the full Programs page

The page works with HTML and CSS alone. The filter buttons and expandable sections use a little JavaScript as an optional extra, and everything is still visible without it.

### Developer note (Task 2)

I approached the Programs page as a continuation of my Task 1 website, keeping the same logo colours, serif and sans-serif typography, buttons and footer so it feels like one brand. I presented the two programs as two contrasting cards at the top, then a full section for each with skill cards, and finally a side-by-side comparison, so visitors can tell them apart quickly. Along the way I learned how to organise a lot of information clearly, and how to build a comparison table that still reads well on a phone. My main challenge was making the two programs feel distinct while keeping the page consistent and using only the skills listed in the brief.

## Task 3: The Internship Tasks experience

For Task 3, a new intern needs to understand the whole internship journey, so I built a dedicated **Internship Tasks page** (`tasks.html`) and connected it to my earlier work. The header and footer now link **Home**, **Programs** and **Internship Tasks** to each other, and the page uses the same logo, colours, typography, buttons and footer as Tasks 1 and 2.

**What the page includes**
- **Introduction:** explains that TechBridge provides a structured 30-day practical internship of 8 tasks, where interns progressively develop their web development skills by completing practical projects
- **All 8 tasks** with the official task number, title, day and description:
  Task 1 (Day 1), Task 2 (Day 4), Task 3 (Day 8), Task 4 (Day 11), Task 5 (Day 15), Task 6 (Day 19), Task 7 (Day 22), Task 8 (Day 26)
- **A roadmap timeline:** the tasks run down a vertical line in order, with the day shown on a marker and an arrow between each stop, so the sequence is easy to follow
- **A 30-day track:** a line from Day 1 to Day 30 with the eight tasks placed at their days, which you can click to jump to a task
- **Difficulty progression:** every task has a label, from Beginner up to Intermediate, with a small meter that fills as the work gets harder
- **Task details:** "View task details" opens what you are expected to build, the day it is introduced, the difficulty, what it builds on, and the technologies where they are known
- **Task status:** each task shows Available, Upcoming or Current task
- **Interactive progress :** every task has To do, In progress and Done buttons, with a progress bar and coloured dots on the 30-day track. Progress is saved on the device and shared with the tracker page
- **Extras:** a difficulty filter, an Expand all button, and a day indicator that shows where today falls in the 30 days

The page works with HTML and CSS alone, and the expandable details use the native HTML `details` element. A small amount of JavaScript adds the filter, the live status and the day indicator as an optional extra, and everything is still visible without it.

### Developer note (Task 3)

I presented the eight tasks as a vertical roadmap, with a day marker on a central line and a card for each task, because a path makes the order and the growing difficulty easy to see at a glance. Above it I added a 30-day track that places each task on its day, and difficulty labels with a small meter that fill up as the tasks get harder. Each card has an expandable section so visitors can see what they are expected to build without crowding the page. I learned how to build a timeline that rearranges itself for mobile and how to use the native details element for expandable content. My main challenge was keeping the alternating timeline readable on small screens, which I solved by switching to a single column with the line on the left.

## Task 4: The Interactive Internship Roadmap

For Task 4, TechBridge wanted visitors to see both internship tracks and understand what they will be doing during the 30-day internship, so I built an **Interactive Internship Roadmap** (`roadmap.html`) on top of my Task 3 work. A visitor chooses **Data Analytics** or **Web Development**, and the page shows that track's complete 8-task journey straight away, with no page refresh.

**What the page includes**
- **Choose Your Track:** two track buttons, with the selected one clearly highlighted
- **Currently viewing:** a banner that names the track being viewed, for example *WEB DEVELOPMENT*, with a *30-Day Practical Internship* badge
- **All 8 tasks for the selected track:** each card shows the task number, title, day, description and difficulty, using the official TechBridge information for both tracks
- **The 30-day structure:** a line from Day 1 to Day 30 with every task placed on its day (Day 1, 4, 8, 11, 15, 19, 22 and 26), plus a vertical timeline with a day marker for each task
- **Difficulty progression:** Beginner, Beginner to Intermediate and Intermediate labels with a small meter, and a bar chart that grows taller as the tasks get harder
- **Navigation:** the header links Home, Programs and the Internship Roadmap, and a link can open a track directly, such as `roadmap.html#data-analytics`

**JavaScript used** (all in `roadmap.js`, with comments showing each concept)
- **Variables:** the currently selected track and the page elements
- **Arrays:** each track stores its 8 tasks in an array
- **Objects:** every task is an object with a number, title, day, description and difficulty
- **Functions:** `showTrack`, `renderTasks`, `renderDayTrack`, `renderRamp`, `updateViewing` and more
- **Event listeners:** clicks and arrow keys on the track buttons, and a listener for address changes
- **Conditional logic:** deciding which track to open and turning each difficulty into a level
- **DOM manipulation:** the page is rebuilt with `createElement`, `textContent`, `classList` and `appendChild`

No frameworks are used, only HTML, CSS and plain JavaScript.

### Developer note (Task 4)

I structured the roadmap as two tracks, Data Analytics and Web Development, each shown with the same layout: a "Currently viewing" banner, a 30-day line, a difficulty chart and eight task cards. When a visitor selects a track, a click event listener calls a `showTrack` function that updates the page without refreshing it. I stored the task information in a JavaScript object where each track holds an array of eight task objects, each with a number, title, day, description and difficulty. I used variables, arrays, objects, functions, event listeners, conditional logic and DOM manipulation, and I labelled each one in the code comments. One challenge was keeping every part of the page in step when the track changes, because the banner, the day line, the difficulty chart and the task cards all depend on the selected track. I solved it by putting all of the updates inside the single `showTrack` function, so one choice refreshes everything in the same way every time.

## Tasks 5 to 8: The TechBridge Intern Portal

For the second half of the internship, I turned the website into a small **internship platform**. All of it runs in the browser with HTML, CSS and JavaScript, and everything an intern enters is saved on their own device only. Nothing is sent to TechBridge from these pages.

| Task | Page | What it does |
|---|---|---|
| Task 5: Intern Registration | `register.html` | A three-step onboarding form (account, profile, confirm) that creates the intern profile |
| Task 6: Task Submission | `submit.html` | Prepare a submission with the task, GitHub link, live link, screenshot and a 3 to 5 sentence developer note, review it, and save it |
| Task 7: Intern Dashboard | `dashboard.html` | Shows the profile, progress, tasks and submissions, with a download-my-data button |
| Task 8: Complete Platform | `portal.html` | The portal home that connects everything, with a map of how all 8 tasks fit together |
| Extra: My progress tracker | `tracker.html` | Mark each of my own 8 tasks as To do, In progress or Done, with a progress ring and a 30-day track |

**How it fits together:** registration creates the profile, the progress tracker records progress, the submission page marks a task as done when work is submitted, and the dashboard and the Internship Tasks page read that same saved information. A portal navigation bar and the main header link every part.

### Developer note (Tasks 5 to 8)

I built the second half of the internship as one connected platform instead of separate pages, so the registration, submission page, progress tracker and dashboard all share the same saved information. I used a small amount of JavaScript and the browser's local storage so progress and submissions stay when the intern comes back. I learned how to share state between pages, build a multi-step form with validation, and design a dashboard that works well when there is no data yet. My main challenge was keeping every page consistent while making each part feel useful on its own.

## Developer note (Tasks 4 to 8)

I built the second half of the internship as one connected platform instead of five separate pages, so the registration, tracker, submission page and dashboard all share the same saved information. I used a small amount of JavaScript and the browser's local storage so progress and submissions stay when the intern comes back. I learned how to share state between pages, build a multi-step form with validation, and design a dashboard that works well when there is no data yet. My main challenge was keeping every page consistent while making each part feel useful on its own.

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
- Instagram: https://www.instagram.com/techbridgeserves
- Facebook: https://www.facebook.com/p/Baselink-Services-100066771475783/

## About me

I'm **Chuks Official**, a web developer and frontend designer. Thank you for taking the time to look at my work.

&copy; 2026 TechBridge by Baselink Services Limited. All rights reserved.
