# TechBridge Homepage: Testing Checklist

I use this list to test the site before I submit. I tick each box only after I have checked it myself.

**Tested on:** _device / browser / date_

## Content
- [ ] TechBridge is clearly explained on the homepage
- [ ] Both programs are shown: Data Analytics and Web Development
- [ ] The 30-day internship is mentioned
- [ ] The recommendation letter is described as *possible*, based on successful participation and performance
- [ ] The tagline "Bridging Learning to Real-World Experience" is visible
- [ ] Only the official email is shown: techbridgebaslink@gmail.com
- [ ] Nothing invented (no fake people, partners, statistics, testimonials or locations)

## Links
- [ ] "Apply now" and the other Apply buttons open the official application form
- [ ] The WhatsApp buttons open the official TechBridge WhatsApp Community
- [ ] Every navigation link scrolls to the right section or opens the right page
- [ ] LinkedIn and Facebook icons open the official pages
- [ ] The email link opens my email app
- [ ] The info sheet PDF downloads and opens correctly

## Responsive design
- [ ] Desktop (about 1280px wide) looks right
- [ ] Tablet (about 768px wide) looks right
- [ ] Mobile (about 390px wide) looks right, and the menu opens and closes
- [ ] No sideways scrolling on any screen size

## Visual quality
- [ ] Text is easy to read on every section
- [ ] Sections are clearly separated
- [ ] Buttons are easy to identify
- [ ] The logo displays correctly in the header, footer and browser tab

## Features
- [ ] Scroll animations and the progress bar work
- [ ] The Learn, Practise, Prove story builds the bridge as I scroll
- [ ] FAQ items open and close
- [ ] Program "Details" popups open and close
- [ ] Quick jump opens with Ctrl+K, filters as I type, and Esc closes it
- [ ] The application page keeps my details after a refresh, and "Clear my details" works
- [ ] The contact form opens my email app with the message filled in
- [ ] The site can be added to a phone's home screen (only works on the https live site)

## Accessibility
- [ ] I can reach every link and button with the Tab key
- [ ] The focus outline is visible
- [ ] With "reduce motion" turned on in my device settings, the animations stop

## Deployment
- [ ] The live site opens from the link in the README
- [ ] All images load on the live site
- [ ] I have added a screenshot to `images/screenshot.png`

---

# Task 2: Programs Page Testing

- [ ] Navigation: the "Programs" link in the header opens `programs.html`, and "Home" or the logo returns to the homepage
- [ ] The "What is this program about?", "Who is it for?" and "How do I get started?" sections open and close under each program
- [ ] Information: both programs are explained clearly, and the difference between them is obvious
- [ ] Skills: Data Analytics shows spreadsheet analysis, data cleaning, SQL, data visualization and business-focused analysis
- [ ] Skills: Web Development shows HTML, CSS, JavaScript, Git/GitHub and building web projects
- [ ] Links: every "Apply for TechBridge Internship" button opens the official application form
- [ ] The "Which sounds more like you?" cards jump to the right program
- [ ] The filter buttons (All, Data Analytics, Web Development) show and hide the right sections
- [ ] The comparison table reads well on desktop and stacks neatly on mobile
- [ ] Responsive: desktop, tablet and mobile all look right
- [ ] Visual consistency: the page matches the Task 1 site (header, footer, buttons, colours, fonts)
- [ ] Screenshot of the Programs page added to the repository

---

# Task 3: Internship Tasks Testing

**Information**
- [ ] All 8 tasks are present and numbered 1 to 8
- [ ] The days are correct: Task 1 Day 1, Task 2 Day 4, Task 3 Day 8, Task 4 Day 11, Task 5 Day 15, Task 6 Day 19, Task 7 Day 22, Task 8 Day 26
- [ ] Every task title and description matches the official wording
- [ ] The page explains the structured 30-day practical internship and the progression of skills
- [ ] The difficulty labels get harder from the first task to the last

**Navigation**
- [ ] The header links work between Home, Programs and Internship Tasks, in both directions
- [ ] The buttons at the bottom of the page lead to Programs, Home and the official application form
- [ ] The dots on the 30-day track jump to the right task

**Features**
- [ ] "View task details" opens and closes on every task
- [ ] The difficulty filter shows the right tasks, and "All tasks" brings them all back
- [ ] "Expand all" and "Collapse all" work
- [ ] The To do, In progress and Done buttons on each task work, the progress bar updates, and my progress is still there after a refresh
- [ ] The page still shows all 8 tasks with JavaScript turned off

**Responsive and usability**
- [ ] Desktop, tablet and mobile all look right, and the timeline becomes a single column on small screens
- [ ] As a new intern, I can understand what I have to complete
- [ ] Screenshot of the Internship Tasks page added to the repository

---

# Tasks 4 to 8: Intern Portal Testing

**Task 4: Tracker**
- [ ] Each task can be set to To do, In progress or Done, and the ring and counts update
- [ ] Progress is still there after I refresh the page
- [ ] The filter and "Reset progress" work

**Task 5: Registration**
- [ ] Each step checks the fields before continuing, and the review step shows my details
- [ ] After registering, the welcome screen shows my name, and the dashboard shows my profile

**Task 6: Submission**
- [ ] The form rejects a non-GitHub link, a link without https, a missing screenshot and a note that is not 3 to 5 sentences
- [ ] After confirming, the task becomes Done in the tracker and the submission appears in the list

**Task 7: Dashboard**
- [ ] Profile, progress, tasks and submissions all show correctly, and the empty state looks right before I register
- [ ] "Download my data" and "Clear all my data" work

**Task 8: Complete platform**
- [ ] The portal home shows live summaries and links to every part
- [ ] "Intern Portal" is in the main navigation on every page and the portal bar works on all portal pages
- [ ] The Internship Tasks page shows a task as Completed after I mark it Done
- [ ] Everything looks right on desktop, tablet and mobile
