/**
 * upGrad School of Technology - Open Source Events
 * Central Data Store with LocalStorage Persistence
 */

const STORAGE_KEYS = {
  EVENTS: 'ugsot_events',
  SECTIONS: 'ugsot_sections',
  STUDENTS: 'ugsot_students',
  USER: 'ugsot_current_user',
  RSVPS: 'ugsot_rsvps'
};

// Calculate dates dynamically relative to now so countdown is always fresh and realistic
const now = new Date();
const addDays = (d, days, hours = 0, minutes = 0) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  result.setHours(result.getHours() + hours);
  result.setMinutes(result.getMinutes() + minutes);
  return result.toISOString();
};

const DEFAULT_EVENTS = [
  {
    id: 'evt-hacktoberfest-2026',
    title: 'Hacktoberfest Hack Day Pune x OSS AIT',
    subtitle: 'Official In-Person Hacktoberfest 2026 Fest at Army Institute of Technology, Pune',
    category: 'opensource',
    isFlagship: true,
    isOngoing: false,
    status: 'upcoming',
    dateBadge: 'Saturday, Oct 17, 2026 • 10:30 AM – 6:30 PM IST',
    startDate: '2026-10-17T05:00:00.000Z',
    targetDate: '2026-10-17T05:00:00.000Z',
    endDate: '2026-10-17T13:00:00.000Z',
    venue: 'Army Institute Of Technology (AIT), Dighi Hills, Alandi Road, Pune 411015',
    mode: 'In-Person Fest (Pune, Maharashtra)',
    banner: 'https://mlhusercontent.com/backgrounds/events/01a0b6b1-9c97-b056-fa2e-02e02678d624/hacktoberfest-hack-day-pune-x-ossc-ait_ccb0a599f60d.png',
    logoUrl: 'https://mlhusercontent.com/logos/events/01a0b6b1-9c97-b056-fa2e-02e02678d624/hacktoberfest-hack-day-pune-x-ossc-ait_10acedd784a8.png',
    description: 'Join us this Hacktoberfest for a day of open-source, coding, and collaboration in Pune! Whether making your first contribution or already experienced with PRs, come find projects, learn Git/GitHub, build with university peers, enjoy sponsored lunch, and collect official MLH swag & developer rewards.',
    prizePool: 'MLH Badges, Exclusive Swag Packs, Tree Planting & Hackathon Goodies',
    stipend: 'Official Swag Kits & Goodies',
    officialUrl: 'https://events.mlh.io/events/15130-hacktoberfest-hack-day-pune-x-oss-ait',
    registrationUrl: 'https://events.mlh.io/events/15130-hacktoberfest-hack-day-pune-x-oss-ait/register',
    spotsTotal: 300,
    spotsFilled: 218,
    tags: ['Hacktoberfest', 'Pune', 'AIT', 'In-Person Fest', 'Open Source', 'MLH', 'GitHub', 'UGSOT'],
    timelineInfo: {
      registration: 'Open now on MLH Events (Student - University pass)',
      activePhase: 'Saturday, October 17, 2026 • 10:30 AM – 6:30 PM IST',
      reviewPhase: 'October 17–31, 2026 (PR verification & swag distribution)'
    },
    speakers: [
      { name: 'OSS AIT Technical Lead', role: 'Campus Open Source Society', avatar: 'AIT' },
      { name: 'GitHub Campus Experts', role: 'Technical Mentors', avatar: 'GH' },
      { name: 'Dr. Kabir Nair', role: 'Dean of Tech, upGrad', avatar: 'KN' }
    ],
    agenda: [
      '10:00 AM: Check-in & Registration',
      '10:30 AM – 12:30 PM: Speaker Session & Git/GitHub Best Practices',
      '12:30 PM – 1:30 PM: Lunch & Networking with Maintainers',
      '1:30 PM – 4:00 PM: Hands-on Open Source Contribution Session',
      '4:00 PM – 4:30 PM: Snacks & Networking',
      '4:30 PM – 5:00 PM: Prizes & Goodies Distribution',
      '5:00 PM – 5:30 PM: Q&A Session & Open Discussion',
      '5:30 PM: Wrap-up & Closing 🎉'
    ]
  },
  {
    id: 'evt-hacktoberfest-pune-cloudnative',
    title: 'Hacktoberfest Hack Day Pune x Cloud Native Pune',
    subtitle: 'Cloud Native Open Source Fest at Gaia Apex, Viman Nagar, Pune',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Saturday, Oct 24, 2026 • 10:00 AM – 5:00 PM IST',
    startDate: '2026-10-24T04:30:00.000Z',
    targetDate: '2026-10-24T04:30:00.000Z',
    endDate: '2026-10-24T11:30:00.000Z',
    venue: 'No. 33, 3rd Floor, Gaia Apex, S, 2D, Viman Nagar, Pune 411014',
    mode: 'In-Person Fest (Viman Nagar, Pune)',
    banner: 'https://mlhusercontent.com/backgrounds/events/01a07d81-9f8b-e908-cfd4-d680f9ef8ff2/hacktoberfest-hack-day-pune-x-cloud-native-pune_3cf371a01d52.png',
    logoUrl: 'https://mlhusercontent.com/logos/events/01a07d81-9f8b-e908-cfd4-d680f9ef8ff2/hacktoberfest-hack-day-pune-x-cloud-native-pune_a5171d239fad.png',
    description: 'Official Hacktoberfest Pune Hack Day hosted with Cloud Native Pune community. Focuses on Kubernetes, containers, microservices, cloud tooling, and open-source contributions with community mentors.',
    prizePool: 'Cloud Native Swag, Official Badges & Certificates',
    stipend: 'Community Swag & Badges',
    officialUrl: 'https://events.mlh.io/events/14885-hacktoberfest-hack-day-pune-x-cloud-native-pune',
    registrationUrl: 'https://events.mlh.io/events/14885-hacktoberfest-hack-day-pune-x-cloud-native-pune/register',
    spotsTotal: 150,
    spotsFilled: 112,
    tags: ['Hacktoberfest', 'Pune', 'Cloud Native', 'Kubernetes', 'Viman Nagar', 'MLH'],
    timelineInfo: {
      registration: 'Open now on MLH Events',
      activePhase: 'Saturday, October 24, 2026 • 10:00 AM – 5:00 PM IST',
      reviewPhase: 'October 24–31, 2026'
    },
    speakers: [
      { name: 'Cloud Native Pune Organizers', role: 'CNCF Community Leaders', avatar: 'CN' }
    ],
    agenda: [
      '10:00 AM: Registration & Keynote: Cloud Native Open Source',
      '11:00 AM – 1:00 PM: Contributing to Kubernetes & Cloud Native Repos',
      '1:00 PM – 2:00 PM: Networking Lunch',
      '2:00 PM – 4:30 PM: Code Sprint & Live Pull Requests',
      '4:30 PM – 5:00 PM: Swag Distribution & Closing'
    ]
  },
  {
    id: 'evt-24pullrequests',
    title: '24 Pull Requests',
    subtitle: 'Giving back to open source for the holidays',
    category: 'opensource',
    isFlagship: false,
    dateBadge: 'Dec 1–24, 2026',
    targetDate: '2026-12-01T00:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    description: 'Challenge yourself to submit 24 pull requests between December 1st and December 24th. An annual global initiative encouraging developers to give small gifts of code back to open source libraries and tools they rely on.',
    prizePool: 'Open Source Karma & Global Hall of Fame Spotlight',
    stipend: 'Community Hall of Fame',
    officialUrl: 'https://24pullrequests.com',
    spotsTotal: 250,
    spotsFilled: 164,
    tags: ['Open Source', 'Sprint', 'GitHub', 'Global', 'AdventOfCode'],
    timelineInfo: {
      registration: 'No prior registration required (Log in with GitHub)',
      activePhase: 'December 1 – December 24, 2026',
      reviewPhase: 'Continuous real-time badge tracking'
    },
    speakers: [
      { name: 'UGSOT Code Squad', role: 'Maintainers', avatar: 'UGSOT' }
    ],
    agenda: [
      'Dec 1: Advent of Code & 24PR Global Kickoff',
      'Dec 1-24: Daily PR challenge track & mentor desk',
      'Dec 24: Hall of Fame & Leaderboard spotlight'
    ]
  },
  {
    id: 'evt-iuwoc',
    title: 'Indian University Winter of Codes',
    subtitle: 'Collegiate open source mentorship across top Indian universities',
    category: 'winterofcode',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Dec 2026 – Feb 2027',
    targetDate: '2026-12-15T10:00:00+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/workshop_banner.jpg',
    description: 'National student open-source initiative uniting university programs across India (including Kharagpur Winter of Code - KWoC, IIIT Kalyani WoC, and JWoC). Connect with university open source societies and receive mentor feedback.',
    prizePool: 'Certificates, Mentorship & University Cash Grants',
    stipend: 'Project Grants & Swag',
    officialUrl: 'https://kwoc.kossiitkgp.in',
    spotsTotal: 300,
    spotsFilled: 198,
    tags: ['Winter of Code', 'India', 'University', 'Mentorship', 'KWoC', 'UGSOT'],
    timelineInfo: {
      registration: 'November 25 – December 14, 2026',
      activePhase: 'December 15, 2026 – February 15, 2027',
      reviewPhase: 'Late February 2027'
    },
    speakers: [
      { name: 'Indian Open Source Consortium', role: 'Mentorship Panel', avatar: 'IN' }
    ],
    agenda: [
      'Dec 15: Student Applications & Project Allocation',
      'Jan: Guided Development & Weekly PR reviews',
      'Feb: Project Evaluations & Final Presentations'
    ]
  },
  {
    id: 'evt-swoc-2027',
    title: 'Social Winter of Code (SWoC)',
    subtitle: 'Beginner-friendly open source mentorship program with gamified leaderboards',
    category: 'winterofcode',
    isFlagship: false,
    isOngoing: true,
    status: 'ongoing',
    dateBadge: 'Jan – Mar 2027',
    startDate: '2026-08-20T00:00:00+05:30',
    targetDate: '2027-01-05T10:00:00+05:30',
    endDate: '2027-03-05T23:59:59+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/flagship_banner.jpg',
    description: 'Social Winter of Code (SWoC Season 7) is a 2-month open-source program designed to introduce university students to real-world software engineering with dedicated mentors, curated issue trails, and leaderboard bounties. Contributor registration is live right now!',
    prizePool: 'Exclusive Swag Kits, Certificates & Top Contributor Badges',
    stipend: 'Swag Packs & Top Bounties',
    officialUrl: 'https://www.swoc.in',
    spotsTotal: 400,
    spotsFilled: 245,
    tags: ['Winter of Code', 'SWoC', 'Beginner Friendly', 'Mentorship', 'India', 'UGSOT'],
    timelineInfo: {
      registration: 'August 20 – December 25, 2026 (Live now)',
      activePhase: 'January 5 – March 5, 2027',
      reviewPhase: 'Mid-March 2027 (Results & Top 50 Awards)'
    },
    speakers: [
      { name: 'SWoC Core Team', role: 'Organizers', avatar: 'SW' }
    ],
    agenda: [
      'Jan 5: Contributor Onboarding & Project matching',
      'Jan 15 - Feb 28: Active contribution period & mentor checkpoints',
      'Mar 10: Results & Top 50 contributor ceremony'
    ]
  },
  {
    id: 'evt-outreachy-dec',
    title: 'Outreachy (Dec cohort)',
    subtitle: 'Paid remote open-source internships for underrepresented builders',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Dec 2026 – Mar 2027',
    targetDate: '2026-12-08T09:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    description: 'Prestigious global program offering 3-month paid remote internships ($7,000 USD stipend + $500 travel allowance) to work with international mentors on Linux kernel, Mozilla, Wikimedia, and other global foundations.',
    prizePool: '$7,000 USD Stipend + $500 Travel Allowance',
    stipend: '$7,000 USD + $500 Travel',
    officialUrl: 'https://www.outreachy.org',
    spotsTotal: 150,
    spotsFilled: 112,
    tags: ['Fellowship', 'Paid Internship', 'Diversity', 'Global', '$7000 Stipend'],
    timelineInfo: {
      registration: 'Initial Apps: Late August; Contribution: October',
      activePhase: 'December 8, 2026 – March 8, 2027',
      reviewPhase: 'Bi-weekly mentor milestone evaluations'
    },
    speakers: [
      { name: 'Outreachy Mentors', role: 'Global Tech Leads', avatar: 'OR' }
    ],
    agenda: [
      'Dec 8: Official 3-Month Internship Kickoff',
      'Jan 15: Mid-term Progress & Code Checkpoint',
      'Mar 8: Final Project Deliverables & Graduation'
    ]
  },
  {
    id: 'evt-season-kde-2027',
    title: 'Season of KDE 2027',
    subtitle: 'Mentored contributions to the renowned KDE open-source ecosystem',
    category: 'mentorship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jan – Mar 2027',
    targetDate: '2027-01-10T10:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    description: 'Season of KDE is an outreach mentorship program hosted by the KDE community, guiding students through non-trivial open source contributions in C++, Qt, desktop environments, web services, and multimedia apps.',
    prizePool: 'Official KDE Certificate of Completion & Community Swag',
    stipend: 'KDE Swag & Certificate',
    officialUrl: 'https://season.kde.org',
    spotsTotal: 120,
    spotsFilled: 88,
    tags: ['Mentorship', 'KDE', 'C++', 'Qt', 'Open Source', 'Global'],
    timelineInfo: {
      registration: 'December 1 – December 31, 2026',
      activePhase: 'January 10 – February 28, 2027',
      reviewPhase: 'Early March 2027 (Certificates issued)'
    },
    speakers: [
      { name: 'KDE Community Leads', role: 'KDE Developers', avatar: 'KD' }
    ],
    agenda: [
      'Jan 10: Work period begins on chosen KDE software',
      'Feb 15: Midterm code checkpoint',
      'Mar 10: Final deliverables merge into KDE master'
    ]
  },
  {
    id: 'evt-lfx-spring-2027',
    title: 'LFX Mentorship (Spring 2027)',
    subtitle: 'Official Linux Foundation mentorship across CNCF, Kubernetes & Linux',
    category: 'mentorship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Mar – May 2027',
    targetDate: '2027-03-01T09:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/flagship_banner.jpg',
    description: 'The Linux Foundation LFX Mentorship provides paid hands-on engineering experience on vital cloud-native open source infrastructure projects including Kubernetes, Prometheus, Hyperledger, and Envoy.',
    prizePool: 'Paid Mentorship Stipend ($3,000 - $6,600 USD)',
    stipend: '$3,000 – $6,600 USD',
    officialUrl: 'https://mentorship.lfx.linuxfoundation.org',
    spotsTotal: 100,
    spotsFilled: 79,
    tags: ['Mentorship', 'Linux Foundation', 'Kubernetes', 'Cloud Native', 'Paid'],
    timelineInfo: {
      registration: 'Mentee Apps: Mid-January – Mid-February 2027',
      activePhase: 'March 1 – May 31, 2027',
      reviewPhase: 'End of May 2027'
    },
    speakers: [
      { name: 'Linux Foundation Leads', role: 'CNCF Maintainers', avatar: 'LF' }
    ],
    agenda: [
      'Mar 1: Sprint 1 architecture & issue assignments',
      'Apr 15: Midterm evaluation & code review',
      'May 31: Graduation & Linux Foundation credentials'
    ]
  },
  {
    id: 'evt-outreachy-may',
    title: 'Outreachy (May cohort)',
    subtitle: 'Summer paid remote international internships in open source',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jun – Aug 2027',
    targetDate: '2027-06-01T09:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    description: 'The summer edition of Outreachy pairing selected university developers with international mentors for 3 months of full-time, fully-remote paid software contributions. Eligible for Northern Hemisphere (including India) students.',
    prizePool: '$7,000 USD Stipend + Global Mentorship Network',
    stipend: '$7,000 USD Stipend',
    officialUrl: 'https://www.outreachy.org',
    spotsTotal: 150,
    spotsFilled: 64,
    tags: ['Fellowship', 'Paid Internship', 'Global', '$7000 Stipend', 'Diversity'],
    timelineInfo: {
      registration: 'Initial Apps: Early February 2027; Contribution: March – April',
      activePhase: 'June 1 – August 31, 2027',
      reviewPhase: 'August 2027'
    },
    speakers: [
      { name: 'Outreachy Organizers', role: 'Mentors', avatar: 'OR' }
    ],
    agenda: [
      'Jun 1: Summer cohort kickoff & mentor pairing',
      'Jul 15: Mid-term evaluation checkpoint',
      'Aug 31: Final code handoff and celebration'
    ]
  },
  {
    id: 'evt-gsoc-2027',
    title: 'GSoC 2027',
    subtitle: 'Google Summer of Code — Premier Global Open-Source Fellowship',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'May – Aug 2027',
    targetDate: '2027-05-01T10:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/flagship_banner.jpg',
    description: 'The world-renowned open-source fellowship by Google. Work on a 12-to-22 week programming project with an international open-source organization under dedicated guidance, funded with a generous Google stipend.',
    prizePool: 'Google Stipend (₹1.5L - ₹3L+ INR / $1,500 - $3,000+ USD)',
    stipend: '₹1.5L – ₹3.0L+ INR ($1.5k–$3k USD)',
    officialUrl: 'https://summerofcode.withgoogle.com',
    spotsTotal: 500,
    spotsFilled: 320,
    tags: ['Google', 'GSoC', 'Fellowship', 'Prestigious', 'High Stipend', 'Global', 'UGSOT'],
    timelineInfo: {
      registration: 'Orgs: Feb; Contributor Proposals: Late March – Mid April 2027',
      activePhase: 'May 1 – May 24 (Bonding) | May 25 – August 31 (Coding)',
      reviewPhase: 'Midterm (July) & Final Evaluations (Late August)'
    },
    speakers: [
      { name: 'Google Open Source Office', role: 'Program Leads', avatar: 'GO' },
      { name: 'Past UGSOT GSoC Mentors', role: 'Alumni Mentors', avatar: 'UGSOT' }
    ],
    agenda: [
      'May 1: Community Bonding Period with Mentors',
      'May 25: Official coding sprint launch',
      'Jul 12: Midterm evaluation & stipend installment',
      'Aug 28: Final code submission & Google evaluation'
    ]
  },
  {
    id: 'evt-summer-of-bitcoin',
    title: 'Summer of Bitcoin 2027',
    subtitle: 'Global bitcoin protocol engineering & UI/UX design fellowship',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Spring – Summer 2027',
    targetDate: '2027-04-15T10:00:00+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    description: 'A global summer fellowship program introducing university students to Bitcoin Core protocol development and Lightning UI/UX design, featuring direct 1:1 mentorship from top protocol maintainers.',
    prizePool: '$3,000+ USD Stipend Paid in Bitcoin + Career Offers',
    stipend: '$3,000+ USD (in Bitcoin)',
    officialUrl: 'https://www.summerofbitcoin.org',
    spotsTotal: 100,
    spotsFilled: 72,
    tags: ['Bitcoin', 'Web3', 'Fellowship', 'High Stipend', 'Global'],
    timelineInfo: {
      registration: 'Applications: Mid-Jan – Mid-Feb; Proposals: Late March – April',
      activePhase: 'Mid-May through Mid-August 2027 (12 weeks)',
      reviewPhase: 'Monthly milestone releases paid in Bitcoin'
    },
    speakers: [
      { name: 'Bitcoin Core Engineers', role: 'Mentors', avatar: 'BTC' }
    ],
    agenda: [
      'Apr 15: Proposal selection & pairing with Bitcoin mentors',
      'May 15: 12-week development phase begins',
      'Jul 1: Midterm deliverable review',
      'Aug 15: Demo Day & fast-track recruitment opportunities'
    ]
  },
  {
    id: 'evt-fossee',
    title: 'FOSSEE Summer Fellowship',
    subtitle: 'Educational open-source software and engineering at IIT Bombay',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Summer 2027',
    targetDate: '2027-05-15T09:00:00+05:30',
    venue: 'Hybrid (IIT Bombay)',
    mode: 'Hybrid (IIT Bombay)',
    banner: 'assets/workshop_banner.jpg',
    description: 'Free and Open Source Software for Education (FOSSEE) fellowship hosted by IIT Bombay under the National Mission on Education. Work on scientific computing, Python, Scilab, and educational web tech either remotely or on-campus.',
    prizePool: 'Monthly Fellowship Stipend & Official IIT Bombay Certificate',
    stipend: 'IIT Bombay Monthly Stipend',
    officialUrl: 'https://fossee.in',
    spotsTotal: 150,
    spotsFilled: 94,
    tags: ['IIT Bombay', 'Fellowship', 'Hybrid', 'Education Tech', 'FLOSS'],
    timelineInfo: {
      registration: 'Screening Tasks: Late March – Mid-April 2027',
      activePhase: 'May 15 – July 15, 2027 (Summer 2027)',
      reviewPhase: 'July 2027 (Final IIT Bombay Presentation)'
    },
    speakers: [
      { name: 'IIT Bombay Faculty', role: 'Principal Investigators', avatar: 'IIT' }
    ],
    agenda: [
      'May 15: Project assignments & orientation',
      'Jun: Development & testing on campus / remote',
      'Jul 15: Final report and IIT Bombay presentation'
    ]
  },
  {
    id: 'evt-ssoc-2027',
    title: 'SSoC 2027',
    subtitle: 'Script Summer of Code — 3-month open-source coding initiative',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jun – Aug 2027',
    targetDate: '2027-06-10T10:00:00+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/codesprint_banner.jpg',
    description: 'A 3-month open source initiative organized by Script Foundation to encourage collegiate programmers across India to get involved with open source development in web dev, AI/ML, and mobile ecosystems.',
    prizePool: 'Trophies, Cash Prizes, Swag Kits & Certificates',
    stipend: 'Cash Bounties & Swag',
    officialUrl: 'https://ssoc.scriptindia.org',
    spotsTotal: 350,
    spotsFilled: 210,
    tags: ['Open Source', 'SSoC', 'India', 'Full-Stack', 'Script Foundation'],
    timelineInfo: {
      registration: 'April – May 2027',
      activePhase: 'June 10 – August 25, 2027',
      reviewPhase: 'Early September 2027'
    },
    speakers: [
      { name: 'Script Foundation', role: 'Core Leads', avatar: 'SF' }
    ],
    agenda: [
      'Jun 10: Contribution period launches',
      'Jul: Mid-program leaderboard updates',
      'Aug 25: Final reviews & prize distribution'
    ]
  },
  {
    id: 'evt-gssoc-2027',
    title: 'GSSoC 2027',
    subtitle: 'GirlScript Summer of Code — India’s premier open source and AI initiative',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Mid/late 2027',
    targetDate: '2027-07-01T10:00:00+05:30',
    venue: 'Online (India-led)',
    mode: 'Online (India-led)',
    banner: 'assets/flagship_banner.jpg',
    description: 'GirlScript Summer of Code is one of India’s largest open source programs featuring both classic open source repository tracks and specialized AI agent tracks. Open to all genders, backgrounds, and skill levels.',
    prizePool: 'Top Performer Swag Packs, Certificates & Sponsor Bounties',
    stipend: 'Bounties & Swag Packs',
    officialUrl: 'https://gssoc.girlscript.tech',
    spotsTotal: 600,
    spotsFilled: 430,
    tags: ['Open Source', 'GSSoC', 'India', 'Diversity', 'AI Agents'],
    timelineInfo: {
      registration: 'Late March – April 2027',
      activePhase: 'Mid-May through August / September 2027',
      reviewPhase: 'Late September 2027'
    },
    speakers: [
      { name: 'GirlScript Foundation', role: 'Organizers', avatar: 'GS' }
    ],
    agenda: [
      'Jul 1: Coding phase begins across participating repos',
      'Aug: Mentor feedback sessions and AMAs',
      'Sep: Top contributor recognition and awards'
    ]
  },
  {
    id: 'evt-mlh-fellowship',
    title: 'MLH Fellowship',
    subtitle: '12-week remote software engineering fellowship alternative to internships',
    category: 'fellowship',
    isFlagship: false,
    isOngoing: true,
    status: 'ongoing',
    dateBadge: 'Rolling cohorts',
    startDate: '2026-09-01T00:00:00+05:30',
    targetDate: '2026-10-15T09:00:00+05:30',
    endDate: '2027-12-31T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    description: 'A 12-week remote internship alternative supported by Major League Hacking. Students are placed in pods with an expert staff engineer mentor to build features for major open-source technologies used by millions worldwide. Rolling cohort applications are live!',
    prizePool: 'Educational Stipend & Real-World Production Experience',
    stipend: 'Need-based Educational Stipend',
    officialUrl: 'https://fellowship.mlh.io',
    spotsTotal: 120,
    spotsFilled: 98,
    tags: ['MLH', 'Fellowship', 'Rolling Cohorts', 'Global', 'Production Code', 'UGSOT'],
    timelineInfo: {
      registration: 'Rolling year-round (Live now)',
      activePhase: '12-week cohorts running Spring, Summer, Fall',
      reviewPhase: 'Continuous pod reviews'
    },
    speakers: [
      { name: 'Major League Hacking Pod Leads', role: 'Staff Engineers', avatar: 'MLH' }
    ],
    agenda: [
      'Week 1: Pod orientation and repository deep-dive',
      'Week 2-10: Production sprint and weekly pair programming',
      'Week 11-12: Final demos, code reviews & graduation'
    ]
  },
  {
    id: 'evt-c4gt',
    title: 'C4GT (Code for GovTech)',
    subtitle: 'India’s dedicated Digital Public Infrastructure open-source fellowship',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Summer 2027',
    targetDate: '2027-05-20T10:00:00+05:30',
    venue: 'Online (India-led)',
    mode: 'Online (India-led)',
    banner: 'assets/codesprint_banner.jpg',
    description: 'Code for GovTech is India’s first open-source program dedicated to creating impactful Digital Public Infrastructure (DPI) products across health, education, and governance, offering 1:1 mentorship from tech leaders.',
    prizePool: '₹1,00,000 INR Stipend + Mentorship from GovTech Leaders',
    stipend: '₹1,00,000 INR Stipend',
    officialUrl: 'https://app.codeforgovtech.in',
    spotsTotal: 80,
    spotsFilled: 55,
    tags: ['GovTech', 'DPI', 'India', '₹1 Lakh Stipend', 'High Impact'],
    timelineInfo: {
      registration: 'Applications open in April 2027',
      activePhase: 'Dedicated Mentoring Program: June – September 2027 (3 Months)',
      reviewPhase: 'Monthly milestone reviews & ₹1 Lakh disbursement'
    },
    speakers: [
      { name: 'GovTech Experts & Architects', role: 'DPI Leads', avatar: 'GT' }
    ],
    agenda: [
      'May 20: Cohort onboarding & problem statements',
      'Jun - Jul: Milestone reviews and mentor checkpoints',
      'Aug - Sep: Production deployment into national public infrastructure repos'
    ]
  }
];

const DEFAULT_SECTIONS = [
  {
    id: 'hero',
    name: 'Hero Branding & Live Countdown Banner',
    title: 'upGrad School of Technology — Open Source Events',
    subtitle: 'Where university builders ship real-world software, break production, and contribute to premier open source events.',
    enabled: true,
    order: 1
  },
  {
    id: 'countdown',
    name: 'Ongoing Flagship Event Live Countdown',
    title: 'Flagship Event Live Countdown Tracker',
    subtitle: 'Clock is ticking. Track active sprints, pin local Hacktoberfest Fests, and claim your verified hacker pass.',
    enabled: true,
    order: 2
  },
  {
    id: 'hacktoberfest-fests',
    name: 'Hacktoberfest 2026 Regional Fests',
    title: 'Hacktoberfest 2026 Fests Near Pune & Neighboring States',
    subtitle: 'Official in-person community Hack Days and meetups from the MLH Hacktoberfest network.',
    enabled: true,
    order: 3
  },
  {
    id: 'events',
    name: 'Upcoming & Active Events Directory',
    title: 'Open Source Events You\'ll Take Part In',
    subtitle: 'Mark your calendar for global open source programs, winter of codes, and developer fellowships.',
    enabled: true,
    order: 4
  },
  {
    id: 'manifesto',
    name: 'Open Source Culture & Bento Showcase',
    title: 'The Gen Z Developer Playground',
    subtitle: 'Zero boring lectures. 100% hands-on building, late-night code sprints, and global hackathon wins.',
    enabled: true,
    order: 4
  },
  {
    id: 'leaderboard',
    name: 'Dev XP Open Source Leaderboard',
    title: 'UGSOT Open Source Events Leaderboard',
    subtitle: 'Earn XP by contributing to open source, winning hackathons, and attending workshops.',
    enabled: true,
    order: 5
  },
  {
    id: 'faq',
    name: 'Open Source Events FAQ',
    title: 'Got Questions? We Got Answers',
    subtitle: 'Everything you need to know about participating in UGSOT Open Source Events.',
    enabled: true,
    order: 6
  }
];

const DEFAULT_STUDENTS = [
  {
    id: 'std-101',
    name: 'Aryan Sharma',
    email: 'aryan.s@tech.upgrad.edu',
    studentId: 'UGSOT-2024-104',
    year: '2nd Year',
    role: 'student',
    devXp: 1450,
    level: 7,
    badges: ['Hackathon Finalist', 'Next.js Wizard', 'Top Contributor'],
    rsvps: ['evt-hacktoberfest-2026', 'evt-gsoc-2027']
  },
  {
    id: 'std-102',
    name: 'Priya Iyer',
    email: 'priya.i@tech.upgrad.edu',
    studentId: 'UGSOT-2024-089',
    year: '3rd Year',
    role: 'student',
    devXp: 2180,
    level: 9,
    badges: ['CSS Battle Champion', 'Open Source Hero', 'Bug Bounty Hunter'],
    rsvps: ['evt-hacktoberfest-2026', 'evt-swoc-2027', 'evt-lfx-spring-2027']
  },
  {
    id: 'std-103',
    name: 'Devansh Kulkarni',
    email: 'devansh.k@tech.upgrad.edu',
    studentId: 'UGSOT-2025-021',
    year: '1st Year',
    role: 'student',
    devXp: 850,
    level: 4,
    badges: ['Freshman Prodigy', 'Workshop Star'],
    rsvps: ['evt-hacktoberfest-2026', 'evt-iuwoc']
  },
  {
    id: 'std-104',
    name: 'Sneha Patel',
    email: 'sneha.p@tech.upgrad.edu',
    studentId: 'UGSOT-2023-142',
    year: '3rd Year',
    role: 'student',
    devXp: 3100,
    level: 12,
    badges: ['Grand Hackathon Winner', 'Full-Stack Architect', 'Dev Rel Ambassador'],
    rsvps: ['evt-hacktoberfest-2026', 'evt-gsoc-2027', 'evt-outreachy-dec', 'evt-c4gt']
  },
  {
    id: 'std-105',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@tech.upgrad.edu',
    studentId: 'UGSOT-2024-210',
    year: '2nd Year',
    role: 'student',
    devXp: 1200,
    level: 6,
    badges: ['Code Sprint Ace', 'Speed Debugger'],
    rsvps: ['evt-24pullrequests', 'evt-ssoc-2027']
  },
  {
    id: 'admin-001',
    name: 'Tanya Mehta (Chapter Lead)',
    email: 'admin@ugsot.upgrad.edu',
    studentId: 'UGSOT-LEAD-01',
    year: '4th Year (Lead)',
    role: 'admin',
    devXp: 5400,
    level: 20,
    badges: ['UGSOT President', 'Vercel Student Fellow', 'Lead Architect'],
    rsvps: ['evt-hacktoberfest-2026', 'evt-gsoc-2027', 'evt-lfx-spring-2027', 'evt-summer-of-bitcoin']
  }
];

const STORE_DATA_VERSION = 'ugsot_v2026_09_23_02';

class ClubStore {
  constructor() {
    // Force cache bust: if stored version is older, reset events and sections to default 15 open source events
    const storedVersion = localStorage.getItem('ust_store_data_version');
    if (storedVersion !== STORE_DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(DEFAULT_SECTIONS));
      localStorage.setItem('ust_store_data_version', STORE_DATA_VERSION);
    }

    this.events = this.load(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    this.sections = this.load(STORAGE_KEYS.SECTIONS, DEFAULT_SECTIONS);
    this.students = this.load(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    
    // Auto-migrate events: ensure 15 verified open source events are loaded
    const hasHacktoberfest = this.events && this.events.some(e => e.id === 'evt-hacktoberfest-2026' && e.timelineInfo);
    if (!hasHacktoberfest || this.events.length < 15) {
      this.events = DEFAULT_EVENTS;
      this.save(STORAGE_KEYS.EVENTS, this.events);
    }

    // Auto-migrate sections
    const evtSec = this.sections.find(s => s.id === 'events');
    if (evtSec && evtSec.title !== "Open Source Events You'll Take Part In") {
      evtSec.title = "Open Source Events You'll Take Part In";
      evtSec.subtitle = "Mark your calendar for global open source programs, winter of codes, and developer fellowships.";
      this.save(STORAGE_KEYS.SECTIONS, this.sections);
    }

    // Auto-migrate any cached localStorage student records to Academic Year & valid RSVPs
    const validEventIds = new Set(this.events.map(e => e.id));
    const yearFallbacks = ['2nd Year', '3rd Year', '1st Year', '3rd Year', '2nd Year', '4th Year (Lead)'];
    this.students.forEach((s, idx) => {
      if (!s.year || s.branch) {
        s.year = s.year || yearFallbacks[idx % yearFallbacks.length];
        delete s.branch;
      }
      if (s.rsvps) {
        s.rsvps = s.rsvps.filter(id => validEventIds.has(id));
        if (s.rsvps.length === 0) s.rsvps = ['evt-hacktoberfest-2026'];
      }
    });
    this.save(STORAGE_KEYS.STUDENTS, this.students);

    this.currentUser = this.load(STORAGE_KEYS.USER, this.students[0]);
    if (this.currentUser) {
      delete this.currentUser.branch;
      if (!this.currentUser.year) this.currentUser.year = '2nd Year';
      if (this.currentUser.rsvps) {
        this.currentUser.rsvps = this.currentUser.rsvps.filter(id => validEventIds.has(id));
        if (this.currentUser.rsvps.length === 0) this.currentUser.rsvps = ['evt-hacktoberfest-2026'];
      }
      this.save(STORAGE_KEYS.USER, this.currentUser);
    }
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Could not load key ${key}`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Could not save key ${key}`, e);
    }
  }

  // Event getters & mutations
  getEvents() {
    return this.events;
  }

  getEventById(id) {
    return this.events.find(e => e.id === id);
  }

  getFlagshipEvent() {
    // 1. Prioritize active ongoing flagship event
    const ongoingFlagship = this.events.find(e => e.isFlagship && (e.isOngoing || e.status === 'ongoing'));
    if (ongoingFlagship) return ongoingFlagship;

    // 2. Any active ongoing event
    const ongoingAny = this.events.find(e => e.isOngoing || e.status === 'ongoing');
    if (ongoingAny) return ongoingAny;

    // 3. Find flagged flagship or the closest upcoming event
    const flagship = this.events.find(e => e.isFlagship && new Date(e.targetDate) > new Date());
    if (flagship) return flagship;
    
    // 4. Otherwise get earliest upcoming event
    const upcoming = this.events
      .filter(e => new Date(e.targetDate) > new Date())
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
      
    return upcoming.length > 0 ? upcoming[0] : this.events[0];
  }

  addEvent(eventData) {
    const newEvent = {
      id: 'evt-' + Date.now().toString(36),
      spotsFilled: 0,
      tags: eventData.tags || ['Open Source', 'UGSOT'],
      speakers: eventData.speakers || [{ name: 'UGSOT Faculty / Mentor', role: 'Mentor', avatar: 'UGSOT' }],
      agenda: eventData.agenda || ['Kickoff & Introductions', 'Main Interactive Session', 'Q&A & Networking'],
      ...eventData
    };
    this.events.unshift(newEvent);
    this.save(STORAGE_KEYS.EVENTS, this.events);
    return newEvent;
  }

  updateEvent(id, updatedFields) {
    const idx = this.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.events[idx] = { ...this.events[idx], ...updatedFields };
      this.save(STORAGE_KEYS.EVENTS, this.events);
      return this.events[idx];
    }
    return null;
  }

  deleteEvent(id) {
    this.events = this.events.filter(e => e.id !== id);
    this.save(STORAGE_KEYS.EVENTS, this.events);
  }

  rsvpToEvent(eventId, studentId) {
    const event = this.getEventById(eventId);
    const student = this.students.find(s => s.id === studentId || s.studentId === studentId);
    
    if (!event || !student) return { success: false, message: 'Event or Student not found' };

    if (!student.rsvps.includes(eventId)) {
      student.rsvps.push(eventId);
      student.devXp = (student.devXp || 0) + 150; // Award XP for registering!
      event.spotsFilled = Math.min((event.spotsFilled || 0) + 1, event.spotsTotal || 100);
      
      this.save(STORAGE_KEYS.STUDENTS, this.students);
      this.save(STORAGE_KEYS.EVENTS, this.events);
      
      if (this.currentUser && (this.currentUser.id === student.id || this.currentUser.studentId === student.studentId)) {
        this.currentUser = student;
        this.save(STORAGE_KEYS.USER, this.currentUser);
      }
      return { success: true, message: `RSVP Confirmed! +150 Dev XP awarded!` };
    }
    return { success: false, message: 'Already registered for this event!' };
  }

  cancelRsvp(eventId, studentId) {
    const event = this.getEventById(eventId);
    const student = this.students.find(s => s.id === studentId || s.studentId === studentId);
    
    if (!event || !student) return { success: false };

    student.rsvps = student.rsvps.filter(id => id !== eventId);
    event.spotsFilled = Math.max(0, (event.spotsFilled || 1) - 1);

    this.save(STORAGE_KEYS.STUDENTS, this.students);
    this.save(STORAGE_KEYS.EVENTS, this.events);

    if (this.currentUser && (this.currentUser.id === student.id || this.currentUser.studentId === student.studentId)) {
      this.currentUser = student;
      this.save(STORAGE_KEYS.USER, this.currentUser);
    }
    return { success: true };
  }

  // Section Management
  getSections() {
    return this.sections.sort((a, b) => a.order - b.order);
  }

  updateSection(id, updates) {
    const section = this.sections.find(s => s.id === id);
    if (section) {
      Object.assign(section, updates);
      this.save(STORAGE_KEYS.SECTIONS, this.sections);
      return section;
    }
    return null;
  }

  // Student Database
  getStudents() {
    return this.students;
  }

  addStudent(studentData) {
    const newStudent = {
      id: 'std-' + Date.now().toString(36),
      devXp: 100,
      level: 1,
      role: 'student',
      badges: ['New Member'],
      rsvps: [],
      ...studentData
    };
    this.students.push(newStudent);
    this.save(STORAGE_KEYS.STUDENTS, this.students);
    return newStudent;
  }

  deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.save(STORAGE_KEYS.STUDENTS, this.students);
  }

  // User Auth & Session
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.save(STORAGE_KEYS.USER, user);
  }

  login(email, password) {
    const found = this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Account not found. Try demo accounts or sign up!' };
  }

  signup(name, email, studentId, year) {
    const exists = this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email already registered! Please sign in.' };
    }

    const newStudent = this.addStudent({
      name,
      email,
      studentId: studentId || `UGSOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      year: year || '1st Year'
    });

    this.setCurrentUser(newStudent);
    return { success: true, user: newStudent };
  }

  switchRole(role) {
    if (role === 'admin') {
      const admin = this.students.find(s => s.role === 'admin') || DEFAULT_STUDENTS[5];
      this.setCurrentUser(admin);
    } else {
      const student = this.students.find(s => s.role === 'student') || DEFAULT_STUDENTS[0];
      this.setCurrentUser(student);
    }
    return this.currentUser;
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.events = DEFAULT_EVENTS;
    this.sections = DEFAULT_SECTIONS;
    this.students = DEFAULT_STUDENTS;
    this.currentUser = DEFAULT_STUDENTS[0];
    return true;
  }
}

// Export singleton instance
window.clubStore = new ClubStore();
