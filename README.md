# Raj Kumar Shukla — Portfolio

A clean, fully functional personal portfolio website.

---

## Folder Structure

```
raj-portfolio/
├── index.html          ← Main HTML file (open this in browser)
├── css/
│   └── style.css       ← All styles (tokens, nav, hero, cards, responsive)
├── js/
│   ├── data.js         ← YOUR DATA — edit projects & social links here
│   └── main.js         ← All interactive functionality
├── images/
│   └── (place your project screenshots here)
├── assets/
│   └── Rajkumar.pdf    ← Your resume — keep this filename or update index.html
└── README.md           ← This file
```

## Customisation Guide

### Add project screenshots
1. Save your screenshot in the `images/` folder (e.g. `images/weather-app.png`)
2. Open `js/data.js` and set `imgPath: 'images/weather-app.png'` for that project

### Add live URLs & GitHub links
Open `js/data.js` and fill in:
```js
liveUrl:   'https://your-live-site.com',
githubUrl: 'https://github.com/yourusername/repo-name',
```

### Update social links
In `js/data.js`, update:
```js
const SOCIAL = {
  github:   'https://github.com/YOUR_USERNAME',
  linkedin: 'https://linkedin.com/in/YOUR_USERNAME'
};
```

### Add a new project
Copy one object inside the `PROJECTS` array in `js/data.js` and fill in the fields.

### Update resume
Replace `assets/Rajkumar.pdf` with your new PDF, keeping the same filename.
Or rename it and update the `href` in `index.html` (search for `Rajkumar.pdf`).

---

## Features
- Dark / Light mode toggle (preference saved in browser)
- Infinite auto-scrolling project carousel (pauses on hover)
- Clickable project cards → modal with Live Site + GitHub buttons
- Contact form → opens Gmail with message pre-filled
- Copy to clipboard for email & phone
- Smooth scroll navigation with active link highlight
- Scroll-reveal animations
- Fully responsive (mobile hamburger menu)
- Back to top button
- Resume PDF download
