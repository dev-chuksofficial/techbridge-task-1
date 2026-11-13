# Submission Pack

One section for each internship task. For every task, submit the **GitHub repository link**, the **live website link**, the **screenshot(s)** and the **developer note**.

**Fill in once, use for every task**

- GitHub repository: `https://github.com/YOUR-USERNAME/techbridge-task-1`
- Live website: `https://YOUR-SITE.vercel.app`

The developer notes below are drafts written from what was actually built. Read each one, change anything that is not true for you, and keep to the sentence count the task asks for (Task 4 asks for 5 to 7 sentences, the others 3 to 5).

---

## Task 1: Build the TechBridge Homepage

- **Page:** `index.html`
- **Live link:** `https://YOUR-SITE.vercel.app/index.html`
- **Screenshot:** `images/screenshot.png`

**Developer note**

I designed the TechBridge homepage around the idea of a bridge, using the colours and circuit mark from the official logo. I built a responsive website with a hero, programs, internship, application and community sections using HTML and CSS, with a little JavaScript for the animations. I learned how to turn a brand into a design, and how to build a mobile menu with CSS only. My main challenge was making the design feel original while using only the official information from the brief.

---

## Task 2: Build the TechBridge Programs Experience

- **Page:** `programs.html`
- **Live link:** `https://YOUR-SITE.vercel.app/programs.html`
- **Screenshot:** `images/screenshot-programs.png`

**Developer note**

I approached the Programs page as a continuation of my Task 1 website, keeping the same logo colours, typography, buttons and footer so it feels like one brand. I presented the two programs as two contrasting cards at the top, then a full section for each with skill cards, and finally a side-by-side comparison, so visitors can tell them apart quickly. I learned how to organise a lot of information clearly, and how to build a comparison table that still reads well on a phone. My main challenge was making the two programs feel distinct while using only the skills listed in the brief.

---

## Task 3: Build the Internship Tasks Experience

- **Page:** `tasks.html`
- **Live link:** `https://YOUR-SITE.vercel.app/tasks.html`
- **Screenshot:** `images/screenshot-tasks.png`

**Developer note**

I presented the eight tasks as a vertical roadmap, with a day marker on a central line and a card for each task, because a path makes the order and the growing difficulty easy to see at a glance. Above it I added a 30-day track that places each task on its day, and difficulty labels with a small meter that fills up as the tasks get harder. Each card has an expandable section so visitors can see what they are expected to build without crowding the page. I learned how to build a timeline that rearranges itself for mobile and how to use the native details element. My main challenge was keeping the alternating timeline readable on small screens, which I solved by switching to a single column.

---

## Task 4: Build an Interactive Internship Roadmap

- **Page:** `roadmap.html`
- **Live link:** `https://YOUR-SITE.vercel.app/roadmap.html`
- **Screenshot:** `images/screenshot-roadmap-data-analytics.png and images/screenshot-roadmap-web-development.png`

**Developer note**

I structured the roadmap as two tracks, Data Analytics and Web Development, each shown with the same layout: a "Currently viewing" banner, a 30-day line, a difficulty chart and eight task cards. When a visitor selects a track, a click event listener calls a showTrack function that updates the page without refreshing it. I stored the task information in a JavaScript object where each track holds an array of eight task objects, each with a number, title, day, description and difficulty. I used variables, arrays, objects, functions, event listeners, conditional logic and DOM manipulation, and I labelled each one in the code comments. One challenge was keeping every part of the page in step when the track changes, because the banner, the day line, the difficulty chart and the task cards all depend on the selected track. I solved it by putting all of the updates inside the single showTrack function, so one choice refreshes everything in the same way every time.

**Extra requirements for Task 4 (only you can do these)**

- [ ] Follow the official TechBridge Instagram account: https://www.instagram.com/techbridgeserves
- [ ] Follow the official TechBridge LinkedIn page: https://www.linkedin.com/company/techbridge-services/
- [ ] Take a screenshot as evidence of each follow (Instagram, and LinkedIn)
- [ ] Upload the screenshots to Google Drive (or another place), and set the link so anyone with it can view
- [ ] Paste the screenshot links in the comment section of the TechBridge Task Submission Form

**A note on the screenshots.** The Task 4 brief mentions screenshots in two ways: "Data Analytics selected" and "Web Development selected" in the Submission section, and follow evidence labelled as the "Data Analytics screenshot" (Instagram) and "Web Development screenshot" (LinkedIn) in the checklist. To be safe, submit all four: the two roadmap screenshots in `images/` and your two follow screenshots.

---

## Task 5: Build the Intern Registration Experience

- **Page:** `register.html`
- **Live link:** `https://YOUR-SITE.vercel.app/register.html`
- **Screenshot:** `images/screenshot-register.png`

**Developer note**

I designed the registration as a three-step onboarding flow, with account details, a profile and a final review, so it feels calm and professional instead of one long form. Each step checks its fields before continuing, and the welcome screen greets the intern by name. I learned how to build a reusable multi-step form with validation and clear error messages. My main challenge was deciding what to ask for, because I wanted a useful profile without collecting more than needed, so I left out passwords.

---

## Task 6: Build the Task Submission System

- **Page:** `submit.html`
- **Live link:** `https://YOUR-SITE.vercel.app/submit.html`
- **Screenshot:** `images/screenshot-submit.png`

**Developer note**

I built the submission page so an intern can choose a task, add a repository link, live link, screenshot and developer note, then review everything before confirming. The form checks for a GitHub link, an https live link, an image under 5 MB and a note of 3 to 5 sentences, which follows the official submission rules. I learned how to validate different kinds of input and how to preview an uploaded image in the browser. My main challenge was checking the sentence count in a helpful way, so I added a live counter.

---

## Task 7: Build the Intern Dashboard

- **Page:** `dashboard.html`
- **Live link:** `https://YOUR-SITE.vercel.app/dashboard.html`
- **Screenshot:** `images/screenshot-dashboard.png`

**Developer note**

I designed the dashboard to give an intern one place to see their profile, progress, tasks and submissions. A progress ring, progress by difficulty and an up-next card make the most useful information easy to scan, and an empty state guides new interns to register. I learned how to build a page from saved data and how to handle the case where there is no data yet. My main challenge was arranging a lot of information so it stays clear on both desktop and mobile.

---

## Task 8: Build the Complete TechBridge Internship Platform

- **Page:** `portal.html`
- **Live link:** `https://YOUR-SITE.vercel.app/portal.html`
- **Screenshot:** `images/screenshot-portal.png`

**Developer note**

For the final task I connected every part of the website into one platform, with a portal home, a shared navigation bar and a map showing how all eight tasks fit together. The registration, tracker, submission page, dashboard and Internship Tasks page all read the same saved information, so an action in one place shows up everywhere. I learned how to share information between pages and how to keep a large project consistent. My main challenge was making the separate pages feel like one product, which I solved with shared styles, navigation and data.

---

## Before you submit each task

- [ ] I replaced the files in my GitHub repository with the latest ones
- [ ] The live website shows the newest version (I hard-refreshed with Ctrl+F5)
- [ ] I opened the page on my phone and on a desktop
- [ ] I clicked the Apply and WhatsApp buttons and they open the right links
- [ ] I added the screenshot(s) and read my developer note
