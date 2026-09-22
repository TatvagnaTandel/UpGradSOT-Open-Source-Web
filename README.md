# upGrad School of Technology — Open Source Events Portal

Official event tracking and community platform for the **upGrad School of Technology (UGSOT) Open Source Chapter**. Built to discover global open source programs, track hackathons, generate verified digital attendee passes, and coordinate student developer roadmaps.

---

## 📌 Overview

The UGSOT Open Source Events platform provides a streamlined interface for university students to engage with open-source initiatives:

* **Real-Time Flagship Countdown**: Multi-unit live countdown for ongoing and upcoming flagship events (e.g., Hacktoberfest, Google Summer of Code, Linux Foundation Mentorship).
* **Open Source Event Directory**: Categorized repository of global mentorship programs, fellowships, winter of code initiatives, and campus hackathons.
* **Verified Attendee Passes**: Generates personalized digital entry passes with Canvas-rendered QR patterns and unique verification hashes.
* **Developer Gamification**: Dev XP reward system tracking student engagement, participation ranks, and community milestones.
* **Admin CMS Dashboard**: Comprehensive management interface for chapter leads to schedule events, manage student rosters, customize site sections, and export attendee data to CSV.

---

## 🛠️ Technology Stack

* **HTML5**: Semantic markup, accessible component hierarchy.
* **CSS3**: Custom design system using native CSS Custom Properties, CSS Grid, Flexbox, and fluid typography (zero external CSS dependencies).
* **JavaScript (ES6+)**: Vanilla client-side architecture with modular controllers:
  * `js/store.js`: Central data store with `localStorage` state management.
  * `js/countdown.js`: Real-time interval timer engine.
  * `js/events.js`: Search, category filtering, `.ics` calendar generation, and canvas QR generator.
  * `js/auth.js`: Session management and student profile rendering.
  * `js/admin.js`: Content management dashboard and CSV export.
  * `js/app.js`: Application lifecycle, sound synthesis (Web Audio API), and terminal Easter egg.

---

## 🚀 Getting Started

### Local Setup

Since the project uses vanilla web standards, it requires no build pipelines or package managers:

```bash
# Clone the repository
git clone https://github.com/TatvagnaTandel/UpGradSOT-Open-Source-Web.git
cd UpGradSOT-Open-Source-Web

# Start any static HTTP server (e.g. Python)
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

---

## 📂 Project Structure

```
├── index.html            # Main application layout & modals
├── .nojekyll             # Static deployment configuration for GitHub Pages
├── assets/               # Branding assets, event banners, and logos
├── css/
│   ├── style.css         # Core design tokens, typography, and reset
│   ├── components.css    # Cards, countdown widgets, buttons, and badges
│   └── admin.css         # Dashboard layout, metrics grid, and CMS forms
└── js/
    ├── store.js          # Seed dataset & localStorage persistence
    ├── countdown.js      # Precision ticker countdown engine
    ├── events.js         # Event filtering, modal views & QR generator
    ├── auth.js           # Student authentication & profile manager
    ├── admin.js          # Admin dashboard & student roster manager
    └── app.js            # Main bootstrap & terminal component
```

---

## 📄 License

Distributed under the MIT License.
