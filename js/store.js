/**
 * upGrad School of Technology - Open Source Events
 * Central Data Store with LocalStorage Persistence
 */

const STORAGE_KEYS = {
  EVENTS: 'ugsot_events',
  SECTIONS: 'ugsot_sections',
  STUDENTS: 'ugsot_students',
  USER: 'ugsot_current_user',
  RSVPS: 'ugsot_rsvps',
  PINNED_EVENT: 'ugsot_pinned_event_id'
};
window.STORAGE_KEYS = STORAGE_KEYS;

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
    isFlagship: false,
    isOngoing: false,
    status: 'past',
    dateBadge: 'Saturday, Oct 17, 2026 • 10:30 AM – 6:30 PM IST',
    startDate: '2026-10-17T05:00:00.000Z',
    targetDate: '2026-10-17T05:00:00.000Z',
    endDate: '2026-10-17T13:00:00.000Z',
    venue: 'Army Institute Of Technology (AIT), Dighi Hills, Alandi Road, Pune 411015',
    mode: 'In-Person Fest (Pune, Maharashtra)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Join us this Hacktoberfest for a day of open-source, coding, and collaboration in Pune! Whether making your first contribution or already experienced with PRs, come find projects, learn Git/GitHub, build with university peers, enjoy sponsored lunch, and collect official MLH swag & developer rewards.',
    prizePool: 'MLH Badges, Exclusive Swag Packs, Tree Planting & Hackathon Goodies',
    stipend: 'Official Swag Kits & Goodies',
    officialUrl: 'https://events.mlh.io/events/15130-hacktoberfest-hack-day-pune-x-oss-ait',
    registrationUrl: 'https://events.mlh.io/events/15130-hacktoberfest-hack-day-pune-x-oss-ait/register',
    spotsTotal: 300,
    spotsFilled: 218,
    tags: ['Hacktoberfest', 'Pune', 'AIT', 'In-Person Fest', 'Open Source', 'MLH', 'GitHub', 'UGSOT'],
    timelineInfo: {
      registration: 'Concluded on MLH Events',
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
    id: 'evt-hacktoberfest-pune-cloudclub',
    title: 'Hacktoberfest Hack Day Pune x Cloud Computing Club',
    subtitle: 'Open-Source AI & Cloud Hack Day at MIT ADT University, Pune',
    category: 'opensource',
    isFlagship: false,
    isOngoing: false,
    status: 'past',
    dateBadge: 'Monday, Oct 13, 2026 • 9:00 AM – 3:30 PM IST',
    startDate: '2026-10-13T03:30:00.000Z',
    targetDate: '2026-10-13T03:30:00.000Z',
    endDate: '2026-10-13T10:00:00.000Z',
    venue: 'MIT ADT University, Rajbaug, Loni Kalbhor, IT Building, 3rd Floor, Pune 412201',
    mode: 'In-Person Fest (Loni Kalbhor, Pune)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Join Cloud Computing Club for Hackstorm, a one-day in-person Hacktoberfest event where participants build with open-source or open-weight AI, submit through OrganizerHQ Challenges, and compete in the Best Open-Source AI Project challenge.',
    prizePool: 'Best Open-Source AI Project Awards, Official MLH Badges & Goodies',
    stipend: 'Official MLH Badges & Swag',
    officialUrl: 'https://events.mlh.io/events/15124-hacktoberfest-hack-day-pune-x-cloud-computing-club',
    registrationUrl: 'https://events.mlh.io/events/15124-hacktoberfest-hack-day-pune-x-cloud-computing-club/register',
    spotsTotal: 200,
    spotsFilled: 135,
    tags: ['Hacktoberfest', 'Pune', 'MIT ADT', 'Cloud Computing', 'Open Source AI', 'MLH', 'UGSOT'],
    timelineInfo: {
      registration: 'Concluded on MLH Events',
      activePhase: 'Monday, October 13, 2026 • 9:00 AM – 3:30 PM IST',
      reviewPhase: 'October 13–20, 2026'
    },
    speakers: [
      { name: 'Cloud Computing Club Leads', role: 'Student Organizers', avatar: 'CC' },
      { name: 'Open-Source AI Mentors', role: 'Technical Mentors', avatar: 'AI' }
    ],
    agenda: [
      '9:00 AM: Check-in & Orientation',
      '9:30 AM – 11:30 AM: Open-Source AI Architecture Workshop',
      '11:30 AM – 1:30 PM: Hands-on AI Hackathon Sprint',
      '1:30 PM – 2:30 PM: Lunch & Project Reviews',
      '2:30 PM – 3:30 PM: Awards & Swag Distribution'
    ]
  },
  {
    id: 'evt-hacktoberfest-pune-cloudnative',
    title: 'Hacktoberfest Hack Day Pune x Cloud Native Pune',
    subtitle: 'Cloud Native Open Source Fest at Gaia Apex, Viman Nagar, Pune',
    category: 'opensource',
    isFlagship: false,
    isOngoing: false,
    status: 'past',
    dateBadge: 'Saturday, Oct 24, 2026 • 10:00 AM – 5:00 PM IST',
    startDate: '2026-10-24T04:30:00.000Z',
    targetDate: '2026-10-24T04:30:00.000Z',
    endDate: '2026-10-24T11:30:00.000Z',
    venue: 'No. 33, 3rd Floor, Gaia Apex, S, 2D, Viman Nagar, Pune 411014',
    mode: 'In-Person Fest (Viman Nagar, Pune)',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Official Hacktoberfest Pune Hack Day hosted with Cloud Native Pune community. Focuses on Kubernetes, containers, microservices, cloud tooling, and open-source contributions with community mentors.',
    prizePool: 'Cloud Native Swag, Official Badges & Certificates',
    stipend: 'Community Swag & Badges',
    officialUrl: 'https://events.mlh.io/events/14885-hacktoberfest-hack-day-pune-x-cloud-native-pune',
    registrationUrl: 'https://events.mlh.io/events/14885-hacktoberfest-hack-day-pune-x-cloud-native-pune/register',
    spotsTotal: 150,
    spotsFilled: 112,
    tags: ['Hacktoberfest', 'Pune', 'Cloud Native', 'Kubernetes', 'Viman Nagar', 'MLH'],
    timelineInfo: {
      registration: 'Concluded on MLH Events',
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
    id: 'evt-hacktoberfest-pune-nstadypu',
    title: 'Hacktoberfest Hack Day Pune x NST ADYPU',
    subtitle: 'Overnight Open Source Community Hackathon at Ajeenkya DY Patil University, Pune',
    category: 'opensource',
    isFlagship: false,
    isOngoing: false,
    status: 'past',
    dateBadge: 'Saturday, Oct 24, 2026 • 3:00 PM – 2:00 AM IST',
    startDate: '2026-10-24T09:30:00.000Z',
    targetDate: '2026-10-24T09:30:00.000Z',
    endDate: '2026-10-24T20:30:00.000Z',
    venue: 'Newton School of Technology, 4th Floor, Ajeenkya DY Patil University, Lohegaon, Pune 412105',
    mode: 'In-Person Fest (Lohegaon, Pune)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Hacktoberfest 2026 at Pune is an Open Source community event hosted by Newton School of Technology at ADYPU University. The event brings together students, developers, and Open Source enthusiasts for an evening of learning, collaboration, and building followed by an overnight Hackathon where teams build, experiment, and collaborate.',
    prizePool: 'Overnight Hackathon Prizes, MLH Swag & Developer Kit',
    stipend: 'Official Goodies & MLH Badges',
    officialUrl: 'https://events.mlh.io/events/15121-hacktoberfest-hack-day-pune-x-nst-adypu',
    registrationUrl: 'https://events.mlh.io/events/15121-hacktoberfest-hack-day-pune-x-nst-adypu/register',
    spotsTotal: 250,
    spotsFilled: 180,
    tags: ['Hacktoberfest', 'Pune', 'NST', 'ADYPU', 'Overnight Hackathon', 'Open Source', 'MLH', 'UGSOT'],
    timelineInfo: {
      registration: 'Concluded on MLH Events',
      activePhase: 'Saturday, October 24, 2026 • 3:00 PM – 2:00 AM IST',
      reviewPhase: 'October 24–31, 2026'
    },
    speakers: [
      { name: 'NST Student Leads', role: 'Newton School of Technology', avatar: 'NST' },
      { name: 'ADYPU Campus Mentors', role: 'Faculty & Mentors', avatar: 'AD' }
    ],
    agenda: [
      '3:00 PM: Check-in & Registrations',
      '4:00 PM – 6:00 PM: Open Source & Git Deep-Dive Keynote',
      '6:00 PM – 8:00 PM: Team Formation & Problem Statements',
      '8:00 PM – 9:00 PM: Dinner & Refreshments',
      '9:00 PM – 1:00 AM: Overnight Hackathon Sprint',
      '1:00 AM – 2:00 AM: Demos, Voting & Wrap-up'
    ]
  },
  {
    id: 'evt-hacktoberfest-pune-aidn',
    title: 'Hacktoberfest Hack Day Pune x AIDN',
    subtitle: 'The Grand Finale Hacktoberfest 2026 Fest in Pune • Orville Business Port, Viman Nagar',
    category: 'opensource',
    isFlagship: true,
    isOngoing: false,
    status: 'upcoming',
    dateBadge: 'Saturday, Oct 31, 2026 • 9:00 AM – 6:00 PM IST (Finale Fest!)',
    startDate: '2026-10-31T03:30:00.000Z',
    targetDate: '2026-10-31T03:30:00.000Z',
    endDate: '2026-10-31T18:29:59.000Z',
    venue: 'Office No 411, 4th Floor, Orville Business Port, West Ave, Opp. Konark Campus, Viman Nagar, Pune 411014',
    mode: 'In-Person Fest (Viman Nagar, Pune)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'The final, culminating in-person Hacktoberfest 2026 Hack Day across Pune! Join community developers, open-source maintainers, and university hackers at Viman Nagar for a full-day code sprint, live PR reviews, sponsored networking lunch, official MLH badge collection, and tree planting before Hacktoberfest officially wraps up on November 1st.',
    prizePool: 'Community Hack Day Awards, Official MLH Badges & Goodies',
    stipend: 'Official Badges & MLH Swag',
    officialUrl: 'https://events.mlh.io/events/15141-hacktoberfest-hack-day-pune-x-aidn',
    registrationUrl: 'https://events.mlh.io/events/15141-hacktoberfest-hack-day-pune-x-aidn/register',
    spotsTotal: 180,
    spotsFilled: 112,
    tags: ['Hacktoberfest', 'Pune', 'AIDN', 'Viman Nagar', 'Hack Day', 'Open Source', 'MLH', 'UGSOT'],
    timelineInfo: {
      registration: 'Open now on MLH Events (Final Spots)',
      activePhase: 'Saturday, October 31, 2026 • 9:00 AM – 6:00 PM IST',
      reviewPhase: 'Midnight Oct 31, 2026 (Hacktoberfest Concludes)'
    },
    speakers: [
      { name: 'AIDN Community Leads', role: 'Event Organizers', avatar: 'AIDN' },
      { name: 'Pune Tech Mentors', role: 'Technical Mentors', avatar: 'PT' }
    ],
    agenda: [
      '9:00 AM: Check-in & Orientation',
      '9:30 AM – 11:30 AM: Open-Source Code Sprint Kickoff',
      '11:30 AM – 1:30 PM: Peer Pair-Programming & PR Reviews',
      '1:30 PM – 2:30 PM: Networking Lunch',
      '2:30 PM – 5:00 PM: Project Demos & Code Showcase',
      '5:00 PM – 6:00 PM: Swag & Closing'
    ]
  },
  {
    id: 'evt-24pullrequests',
    title: '24 Pull Requests',
    subtitle: 'Giving back to open source for the holidays',
    category: 'opensource',
    isFlagship: false,
    isOngoing: false,
    status: 'upcoming',
    dateBadge: 'Dec 1–24, 2026',
    startDate: '2026-12-01T00:00:00+05:30',
    targetDate: '2026-12-01T00:00:00+05:30',
    endDate: '2026-12-24T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'Indian University Winter of Codes (KWoC / IUWoC)',
    subtitle: 'Collegiate open source mentorship across top Indian universities',
    category: 'winterofcode',
    isFlagship: false,
    isOngoing: false,
    status: 'upcoming',
    dateBadge: 'Dec 2026 – Jan 2027 • Mentor Call Late Nov',
    startDate: '2026-11-25T10:00:00+05:30',
    targetDate: '2026-12-06T10:00:00+05:30',
    endDate: '2027-01-15T23:59:59+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'National student open-source initiative uniting university programs across India (including Kharagpur Winter of Code - KWoC, IIIT Kalyani WoC, and JWoC). Connect with university open source societies and receive mentor feedback.',
    prizePool: 'Certificates, Mentorship & University Cash Grants',
    stipend: 'Project Grants & Swag',
    officialUrl: 'https://kwoc.kossiitkgp.org',
    spotsTotal: 300,
    spotsFilled: 198,
    tags: ['Winter of Code', 'India', 'University', 'Mentorship', 'KWoC', 'UGSOT'],
    timelineInfo: {
      registration: 'Mentor Apps: Late Nov; Student Apps: Early Dec 2026',
      activePhase: 'December 6, 2026 – January 10, 2027',
      reviewPhase: 'Late January 2027'
    },
    speakers: [
      { name: 'Indian Open Source Consortium', role: 'Mentorship Panel', avatar: 'IN' }
    ],
    agenda: [
      'Nov 25: Mentor registrations and project submissions open',
      'Dec 6: Student onboarding & coding sprint commences',
      'Dec 25: Mid-term evaluation & mentor checkpoints',
      'Jan 10: End-term project submissions & evaluations'
    ]
  },
  {
    id: 'evt-swoc-2027',
    title: 'Social Winter of Code (SWoC Season 7)',
    subtitle: 'Premier open-source mentorship program with gamified leaderboards & prizes',
    category: 'winterofcode',
    isFlagship: false,
    isOngoing: true,
    status: 'ongoing',
    dateBadge: 'Nov 1, 2026 – Jan 31, 2027 • Contributor Registration LIVE',
    startDate: '2026-10-01T00:00:00+05:30',
    targetDate: '2026-11-01T10:00:00+05:30',
    endDate: '2027-01-31T23:59:59+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Social Winter of Code (SWoC Season 7) is an open-source program designed to introduce university students to real-world software engineering with dedicated mentors, curated issue trails, and leaderboard bounties. Contributor registration is officially OPEN right now on swoc.in, with the coding sprint kicking off November 1, 2026!',
    prizePool: 'Exclusive Swag Kits, Certificates & Top Contributor Badges',
    stipend: 'Swag Packs & Top Bounties',
    officialUrl: 'https://www.swoc.in',
    spotsTotal: 500,
    spotsFilled: 310,
    tags: ['Winter of Code', 'SWoC', 'Beginner Friendly', 'Mentorship', 'India', 'UGSOT'],
    timelineInfo: {
      registration: 'October 1 – December 31, 2026 (Live now on swoc.in)',
      activePhase: 'November 1, 2026 – January 31, 2027 (Coding sprint)',
      reviewPhase: 'February 10, 2027 (Results & Top Contributor Awards)'
    },
    speakers: [
      { name: 'SWoC Core Team', role: 'Organizers', avatar: 'SW' }
    ],
    agenda: [
      'Oct 1 – Dec 31: Contributor registrations open on swoc.in',
      'Nov 1: Official coding period commences across participating repos',
      'Dec 15: Midterm progress review & mentor checkpoints',
      'Jan 31: Contribution period concludes',
      'Feb 10: Official certificate distribution & top leaderboard awards'
    ]
  },
  {
    id: 'evt-outreachy-dec',
    title: 'Outreachy (Dec 2026 Cohort)',
    subtitle: 'Paid remote open-source internships ($7,000 USD stipend + $500 travel allowance)',
    category: 'fellowship',
    isFlagship: false,
    isOngoing: true,
    status: 'ongoing',
    dateBadge: 'Dec 7, 2026 – Mar 8, 2027 • Contribution Window Closes Nov 9',
    startDate: '2026-10-12T00:00:00.000Z',
    targetDate: '2026-11-09T16:00:00.000Z',
    endDate: '2027-03-08T23:59:59.000Z',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Prestigious global program offering 3-month paid remote internships ($7,000 USD stipend + $500 travel allowance) to work with international mentors on Linux kernel, Mozilla, Wikimedia, and other global foundations. The open-source contribution phase is actively running right now through November 9, 2026!',
    prizePool: '$7,000 USD Stipend + $500 Travel Allowance',
    stipend: '$7,000 USD + $500 Travel',
    officialUrl: 'https://www.outreachy.org',
    spotsTotal: 150,
    spotsFilled: 112,
    tags: ['Fellowship', 'Paid Internship', 'Diversity', 'Global', '$7000 Stipend'],
    timelineInfo: {
      registration: 'Initial Apps: August; Contribution Sprint: Oct 12 – Nov 9, 2026 (Active now)',
      activePhase: 'December 7, 2026 – March 8, 2027 (3-Month Paid Internship)',
      reviewPhase: 'Intern selections announced: November 30, 2026'
    },
    speakers: [
      { name: 'Outreachy Mentors', role: 'Global Tech Leads', avatar: 'OR' }
    ],
    agenda: [
      'Oct 12 – Nov 9: Live contribution period on community projects',
      'Nov 9 (4:00 PM UTC): Final contribution deadline & application close',
      'Nov 30: Intern selections publicly announced',
      'Dec 7, 2026 – Mar 8, 2027: Official 3-month paid internship'
    ]
  },
  {
    id: 'evt-season-kde-2027',
    title: 'Season of KDE 2027',
    subtitle: 'Mentored contributions to the renowned KDE open-source ecosystem',
    category: 'mentorship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jan – Mar 2027 • Proposals Open Dec 2026',
    startDate: '2026-12-01T10:00:00+05:30',
    targetDate: '2027-01-10T10:00:00+05:30',
    endDate: '2027-03-15T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    dateBadge: 'Mar – May 2027 • Applications Mid-Jan',
    startDate: '2027-01-15T09:00:00+05:30',
    targetDate: '2027-03-01T09:00:00+05:30',
    endDate: '2027-05-31T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    dateBadge: 'Jun – Aug 2027 • Applications Early Feb',
    startDate: '2027-02-01T09:00:00+05:30',
    targetDate: '2027-06-01T09:00:00+05:30',
    endDate: '2027-08-31T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'GSoC 2027 (Google Summer of Code)',
    subtitle: 'Google Summer of Code — Premier Global Open-Source Fellowship',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'May – Aug 2027 • Proposals Late March',
    startDate: '2027-02-01T10:00:00+05:30',
    targetDate: '2027-03-23T18:00:00+05:30',
    endDate: '2027-08-31T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    dateBadge: 'Spring – Summer 2027 • Applications Mid-Jan',
    startDate: '2027-01-15T10:00:00+05:30',
    targetDate: '2027-04-15T10:00:00+05:30',
    endDate: '2027-08-20T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'FOSSEE Summer Fellowship 2027',
    subtitle: 'Educational open-source software and engineering at IIT Bombay',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Summer 2027 • Screening Tasks Late March',
    startDate: '2027-03-15T09:00:00+05:30',
    targetDate: '2027-05-15T09:00:00+05:30',
    endDate: '2027-07-20T23:59:59+05:30',
    venue: 'Hybrid (IIT Bombay)',
    mode: 'Hybrid (IIT Bombay)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'SSoC 2027 (Script Summer of Code)',
    subtitle: 'Script Summer of Code — 3-month open-source coding initiative',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jun – Aug 2027 • Registrations April – May',
    startDate: '2027-04-01T10:00:00+05:30',
    targetDate: '2027-06-10T10:00:00+05:30',
    endDate: '2027-08-25T23:59:59+05:30',
    venue: 'Online (India)',
    mode: 'Online (India)',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'GSSoC 2027 (GirlScript Summer of Code)',
    subtitle: 'GirlScript Summer of Code — India’s premier open source and AI initiative',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Mid/Late 2027 • Registrations Late March',
    startDate: '2027-04-01T10:00:00+05:30',
    targetDate: '2027-05-15T10:00:00+05:30',
    endDate: '2027-08-31T23:59:59+05:30',
    venue: 'Online (India-led)',
    mode: 'Online (India-led)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    dateBadge: 'Rolling Cohorts Year-Round • Live Now',
    startDate: '2026-09-01T00:00:00+05:30',
    targetDate: '2027-01-15T09:00:00+05:30',
    endDate: '2027-12-31T23:59:59+05:30',
    venue: 'Online / global',
    mode: 'Online / global',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
    title: 'C4GT (Code for GovTech 2027)',
    subtitle: 'India’s dedicated Digital Public Infrastructure open-source fellowship',
    category: 'fellowship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Summer 2027 • Mentoring Applications April',
    startDate: '2027-04-01T10:00:00+05:30',
    targetDate: '2027-05-20T10:00:00+05:30',
    endDate: '2027-09-30T23:59:59+05:30',
    venue: 'Online (India-led)',
    mode: 'Online (India-led)',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
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
  },
  {
    id: 'evt-science-academies-2027',
    title: "Science Academies' Summer Research Fellowship (SRPF 2027)",
    subtitle: 'IASc – INSA – NASI prestigious summer research fellowship in computational sciences & open research',
    category: 'fellowship',
    isFlagship: false,
    isOngoing: true,
    status: 'ongoing',
    dateBadge: 'May – July 2027 • Applications Close Nov 30, 2026 (Live Now)',
    startDate: '2026-10-01T00:00:00+05:30',
    targetDate: '2026-11-30T17:00:00+05:30',
    endDate: '2027-07-31T23:59:59+05:30',
    venue: 'National Science Academies / Premier Indian Research Labs (IISc, IITs, TIFR)',
    mode: 'In-Person / Lab Fellowship (India)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Prestigious national fellowship offered jointly by Indian Academy of Sciences (IASc, Bengaluru), Indian National Science Academy (INSA, New Delhi), and The National Academy of Sciences India (NASI, Prayagraj). Work on cutting-edge computational sciences, data engineering, and open research algorithms with premier scientists and academy fellows. Applications are officially open until November 30, 2026!',
    prizePool: 'Monthly Research Stipend + Roundtrip Travel + Premier Lab Placement',
    stipend: 'Monthly Research Stipend + Travel',
    officialUrl: 'https://web-japps.ias.ac.in/fellowship2027/',
    spotsTotal: 200,
    spotsFilled: 84,
    tags: ['Fellowship', 'Research', 'IISc', 'IITs', 'Data Science', 'India', 'UGSOT'],
    timelineInfo: {
      registration: 'Applications close November 30, 2026 (Live now)',
      activePhase: 'May – July 2027 (Two months full-time research)',
      reviewPhase: 'Results declared late February / March 2027'
    },
    speakers: [
      { name: 'Academy Fellowship Committee', role: 'IASc - INSA - NASI Panel', avatar: 'IAS' }
    ],
    agenda: [
      'Nov 30, 2026: Application and recommendation letter submission deadline',
      'Mar 2027: Guide allocation & academy selection results',
      'May 2027: Two months summer research period commences'
    ]
  },
  {
    id: 'evt-ethindia-2026',
    title: 'ETHIndia 2026',
    subtitle: "Asia's Largest Web3 Hackathon & Open Source BUIDL Sprint",
    category: 'hackathon',
    isFlagship: false,
    isOngoing: false,
    status: 'upcoming',
    dateBadge: 'Dec 5–7, 2026 • KTPO Bengaluru, India',
    startDate: '2026-12-05T09:00:00+05:30',
    targetDate: '2026-12-05T09:00:00+05:30',
    endDate: '2026-12-07T18:00:00+05:30',
    venue: 'KTPO Convention Centre, Whitefield, Bengaluru, Karnataka 560066',
    mode: 'In-Person Hackathon (Bengaluru, India)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'ETHIndia is the premier Ethereum and Web3 open source hackathon in Asia, gathering over 2,000+ top engineers, maintainers, and builders from across the globe. 36 hours of non-stop hacking, developer workshops, world-class mentorship, sponsored bounties, and international ecosystem support.',
    prizePool: '$100,000+ USD in Bounties, Grants & Open Source Tracks',
    stipend: '$100k+ Prize Pool & Travel Scholarships',
    officialUrl: 'https://ethindia.co',
    spotsTotal: 2000,
    spotsFilled: 1680,
    tags: ['Web3', 'Ethereum', 'Hackathon', 'Bengaluru', 'Global', 'In-Person', 'UGSOT'],
    timelineInfo: {
      registration: 'Applications open on Devfolio (Rolling selections)',
      activePhase: 'December 5 – 7, 2026 (36 Hours In-Person Hackathon)',
      reviewPhase: 'December 7, 2026 • Grand Finale & Project Showcase'
    },
    speakers: [
      { name: 'Devfolio & ETHGlobal Mentors', role: 'Hackathon Leads', avatar: 'ETH' },
      { name: 'Core Protocol Maintainers', role: 'Technical Judges', avatar: 'WEB3' }
    ],
    agenda: [
      'Dec 5, 9:00 AM: Check-in, Sponsor Booths & Opening Ceremony',
      'Dec 5, 12:00 PM: 36-Hour Open Source Hacking Begins',
      'Dec 6: Mentor feedback checkpoints & midnight dev workshops',
      'Dec 7, 12:00 PM: Hacking closes & judging rounds',
      'Dec 7, 4:00 PM: Closing Ceremony, Top 10 Demos & $100k+ Awards'
    ]
  },
  {
    id: 'evt-google-solution-challenge-2027',
    title: 'Google Solution Challenge 2027',
    subtitle: 'Solve for one of the UN 17 Sustainable Development Goals using Google tech',
    category: 'opensource',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jan – May 2027 • Global Student Competition',
    startDate: '2027-01-15T09:00:00+05:30',
    targetDate: '2027-01-15T09:00:00+05:30',
    endDate: '2027-05-31T23:59:59+05:30',
    venue: 'Online / Global (Google Developer Student Clubs)',
    mode: 'Online / Global',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'The Google Solution Challenge invites university students around the world to build solutions for one or more of the United Nations 17 Sustainable Development Goals using Google products, open-source APIs, Gemini AI, Android, and Google Cloud.',
    prizePool: '$12,000+ USD in Cash Awards, Google Mentorship & Global Showcase',
    stipend: '$12,000+ USD Top Prizes & Mentorship',
    officialUrl: 'https://developers.google.com/community/gdsc-solution-challenge',
    spotsTotal: 500,
    spotsFilled: 290,
    tags: ['Google', 'Solution Challenge', 'UN SDGs', 'Gemini AI', 'Android', 'Cloud', 'UGSOT'],
    timelineInfo: {
      registration: 'Hack Pack & Project Kickoff: January 2027',
      activePhase: 'January – March 2027 (Solution Building Sprint)',
      reviewPhase: 'Top 100 & Top 10 Global Finalist Demo Day: April – May 2027'
    },
    speakers: [
      { name: 'Google Developer Relations Leads', role: 'Google Mentors', avatar: 'GD' }
    ],
    agenda: [
      'Jan 15, 2027: Global Hack Pack release & team registration opens',
      'Mar 31, 2027: Video demo and GitHub repository submission',
      'May 2027: Global Demo Day livestream & Top 3 winners announcement'
    ]
  },
  {
    id: 'evt-microsoft-imagine-cup-2027',
    title: 'Microsoft Imagine Cup 2027',
    subtitle: 'Global student AI startup competition & Microsoft Founder Hub incubator',
    category: 'hackathon',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Jan – May 2027 • Global Semifinals & World Finals',
    startDate: '2026-12-01T00:00:00+05:30',
    targetDate: '2027-01-25T10:00:00+05:30',
    endDate: '2027-05-31T23:59:59+05:30',
    venue: 'Online & Microsoft Campus (Redmond, USA)',
    mode: 'Hybrid (Online Semifinals + Global Finals)',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: "Imagine Cup is Microsoft's premier global technology and AI competition for student visionaries. Build an AI-driven venture leveraging Azure AI, GitHub, and open-source models for a chance to win $100,000 USD, Microsoft founder mentorship, and direct pitch opportunities.",
    prizePool: '$100,000 USD Grand Prize + Azure Cloud Credits + Satya Nadella Mentorship',
    stipend: '$100,000 USD + $50k Azure Credits',
    officialUrl: 'https://imaginecup.microsoft.com',
    spotsTotal: 400,
    spotsFilled: 215,
    tags: ['Microsoft', 'Imagine Cup', 'AI Startup', 'Azure', 'Global', 'Redmond', 'UGSOT'],
    timelineInfo: {
      registration: 'Qualifying Round Closes: Late January 2027',
      activePhase: 'February – March 2027 (Semifinals & Mentorship Cohort)',
      reviewPhase: 'World Championship at Microsoft Build: May 2027'
    },
    speakers: [
      { name: 'Microsoft Cloud Advocates', role: 'AI Mentors', avatar: 'MS' }
    ],
    agenda: [
      'Jan 25, 2027: Submission deadline for Prototype & Pitch Deck',
      'Mar 2027: Imagine Cup World Semifinals',
      'May 2027: World Championship live on stage at Microsoft Build'
    ]
  },
  {
    id: 'evt-smart-india-hackathon-2027',
    title: 'Smart India Hackathon (SIH 2027)',
    subtitle: "World's biggest open innovation hackathon across Government Ministries & Industry",
    category: 'hackathon',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Feb – Sept 2027 • Nodal Centers Across India',
    startDate: '2027-02-20T10:00:00+05:30',
    targetDate: '2027-02-20T10:00:00+05:30',
    endDate: '2027-09-30T23:59:59+05:30',
    venue: 'Designated Nodal Centers Across India (including Pune, Mumbai, Delhi, Bengaluru)',
    mode: 'Hybrid (Internal Collegiate Hackathons + In-Person Grand Finale)',
    banner: 'assets/flagship_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: "Smart India Hackathon is a nationwide initiative by the Ministry of Education's Innovation Cell (MIC) and AICTE. Over 2,000 institutions tackle mission-critical challenges posed by Central Ministries, State Governments, and industry leaders across hardware, open web, AI, and cybersecurity.",
    prizePool: '₹1,00,000 INR per problem statement winner + Central Ministry incubation',
    stipend: '₹1,00,000 INR Per Problem Statement',
    officialUrl: 'https://sih.gov.in',
    spotsTotal: 600,
    spotsFilled: 380,
    tags: ['SIH', 'Hackathon', 'National', 'GovTech', 'Ministry of Education', 'Pune Nodal', 'UGSOT'],
    timelineInfo: {
      registration: 'Campus Internal Hackathon nominations: February – March 2027',
      activePhase: 'National evaluation rounds: April – July 2027',
      reviewPhase: '36-Hour In-Person Grand Finale: August / September 2027'
    },
    speakers: [
      { name: 'MIC / AICTE Directors', role: 'Innovation Officers', avatar: 'SIH' },
      { name: 'Ministry Chief Technologists', role: 'Problem Statement Owners', avatar: 'GOV' }
    ],
    agenda: [
      'Feb 20, 2027: College SPOC registration and team selection window opens',
      'Apr 2027: National problem statement idea submissions',
      'Aug 2027: 36-hour non-stop in-person coding at nationwide nodal centers'
    ]
  },
  {
    id: 'evt-gsod-2027',
    title: 'Google Season of Docs 2027 (GSoD)',
    subtitle: 'Connecting open source organizations with technical writers to supercharge documentation',
    category: 'mentorship',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Mar – Nov 2027 • Global Technical Writing Initiative',
    startDate: '2027-02-15T09:00:00+05:30',
    targetDate: '2027-03-15T09:00:00+05:30',
    endDate: '2027-11-30T23:59:59+05:30',
    venue: 'Online / Global (Google Open Source Programs Office)',
    mode: 'Online / Global',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'Google Season of Docs fosters collaboration between open source projects and professional technical writers or engineering contributors. Enhance documentation, onboarding roadmaps, API tutorials, and architecture diagrams for world-class open-source projects.',
    prizePool: '$5,000 - $15,000 USD Project Grants per Selected Open-Source Org',
    stipend: '$5,000 – $15,000 USD Org Grant / Stipend',
    officialUrl: 'https://developers.google.com/season-of-docs',
    spotsTotal: 100,
    spotsFilled: 52,
    tags: ['Google', 'GSoD', 'Technical Writing', 'Documentation', 'Open Source', 'Global'],
    timelineInfo: {
      registration: 'Organization Applications: February – March 2027; Contributor hiring: May 2027',
      activePhase: 'May – November 2027 (Technical Writing & Architecture Documentation)',
      reviewPhase: 'December 2027 (Final Project Case Studies)'
    },
    speakers: [
      { name: 'Google Open Source Documentation Panel', role: 'Program Leads', avatar: 'GSO' }
    ],
    agenda: [
      'Mar 15, 2027: Open source orgs submit documentation enhancement proposals',
      'May 2027: Technical writers and student contributors matched with projects',
      'Nov 2027: Documentation releases deployed live to project sites'
    ]
  },
  {
    id: 'evt-flipkart-grid-7',
    title: 'Flipkart GRiD 7.0',
    subtitle: 'Premier Engineering & Robotics Campus Challenge with pre-placement interviews (PPIs)',
    category: 'hackathon',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Mar – Aug 2027 • National Engineering Challenge',
    startDate: '2027-03-01T10:00:00+05:30',
    targetDate: '2027-03-25T10:00:00+05:30',
    endDate: '2027-08-31T23:59:59+05:30',
    venue: 'Online (Rounds 1–2) & Flipkart Headquarters Bengaluru (Grand Finale)',
    mode: 'Hybrid (Online Coding + Bengaluru Onsite Finale)',
    banner: 'assets/codesprint_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: "Flipkart GRiD is Flipkart's flagship pan-India campus challenge testing engineers across Software Development (E-Commerce, Web3, Generative AI), Robotics, and Information Security. Offers direct SDE internship and full-time PPI opportunities.",
    prizePool: '₹10,50,000 INR Prize Pool + Direct SDE Pre-Placement Interviews (PPIs)',
    stipend: '₹10.5 Lakh Prize Pool + Flipkart PPIs',
    officialUrl: 'https://unstop.com/competitions/flipkart-grid',
    spotsTotal: 500,
    spotsFilled: 310,
    tags: ['Flipkart', 'GRiD', 'Campus Challenge', 'PPI', 'Software Engineering', 'India', 'UGSOT'],
    timelineInfo: {
      registration: 'March 2027 on Unstop',
      activePhase: 'Round 1 (Online Quiz) & Round 2 (Coding & Proof of Concept): April – June 2027',
      reviewPhase: 'Grand Finale & Live Demonstrations: August 2027'
    },
    speakers: [
      { name: 'Flipkart Principal Engineers', role: 'Technical Panel', avatar: 'FK' }
    ],
    agenda: [
      'Mar 25, 2027: Track registration opens on Unstop',
      'May 2027: Problem Statement submission & prototype evaluation',
      'Aug 2027: Onsite Grand Finale at Flipkart Bengaluru & PPI announcements'
    ]
  },
  {
    id: 'evt-nasa-space-apps-2027',
    title: 'NASA International Space Apps Challenge 2027',
    subtitle: "World's largest global hackathon using open NASA science and space data",
    category: 'hackathon',
    isFlagship: false,
    status: 'upcoming',
    dateBadge: 'Apr 2027 (Pre-Season) • Oct 2027 (Global Hackathon)',
    startDate: '2027-04-10T10:00:00+05:30',
    targetDate: '2027-04-10T10:00:00+05:30',
    endDate: '2027-10-10T23:59:59+05:30',
    venue: 'Local Lead Centers Worldwide (including Pune & Mumbai) & Virtual',
    mode: 'Hybrid (Pune In-Person + Global Virtual)',
    banner: 'assets/workshop_banner.jpg',
    logoUrl: 'assets/logo.jpg',
    description: 'The NASA International Space Apps Challenge is an international hackathon for coders, scientists, designers, storytellers, makers, and technologists. Teams address real-world challenges on Earth and in space using free and open data from NASA and its Space Agency Partners.',
    prizePool: 'Global Winner Awards, Space Agency Honors & NASA Rocket Launch Invite',
    stipend: 'Global Winner Honors & Rocket Launch Invitation',
    officialUrl: 'https://www.spaceappschallenge.org',
    spotsTotal: 400,
    spotsFilled: 190,
    tags: ['NASA', 'Space Apps', 'Open Data', 'Global Hackathon', 'Pune Local Lead', 'UGSOT'],
    timelineInfo: {
      registration: 'Local Lead center registration: April 2027; Hacker registration: July 2027',
      activePhase: '48-Hour Global Hackathon Weekend (October 2027)',
      reviewPhase: 'Global Nominee & Winner Announcements: December 2027'
    },
    speakers: [
      { name: 'NASA Space Apps Global Organizing Team', role: 'Space Agency Leads', avatar: 'NASA' }
    ],
    agenda: [
      'Apr 10, 2027: City Lead Applications & Hackathon Theme Reveal',
      'Jul 2027: Participant registration & challenge briefs published',
      'Oct 2027: 48-hour global challenge sprint with Pune local center'
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

const STORE_DATA_VERSION = 'ugsot_v2026_10_29_02';

class ClubStore {
  constructor() {
    // Force cache bust: if stored version is older, reset events and sections to default 27 open source events
    const storedVersion = localStorage.getItem('ust_store_data_version');
    if (storedVersion !== STORE_DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(DEFAULT_SECTIONS));
      localStorage.setItem('ust_store_data_version', STORE_DATA_VERSION);
    }

    this.events = this.load(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    this.sections = this.load(STORAGE_KEYS.SECTIONS, DEFAULT_SECTIONS);
    this.students = this.load(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    
    // Auto-migrate events: ensure all 27 verified open source events (including AIDN finale & 2026-2027 calendar programs) are loaded
    const hasAidnPuneFlagship = this.events && this.events.some(e => e.id === 'evt-hacktoberfest-pune-aidn' && e.isFlagship);
    const hasSwocSeason7 = this.events && this.events.some(e => e.id === 'evt-swoc-2027' && e.title.includes('Season 7'));
    if (!hasAidnPuneFlagship || !hasSwocSeason7 || this.events.length < 27) {
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
    if (!id) return null;
    if (this.events) {
      const found = this.events.find(e => e.id === id);
      if (found) return found;
    }
    if (typeof HACKTOBERFEST_FESTS_DATA !== 'undefined' && Array.isArray(HACKTOBERFEST_FESTS_DATA)) {
      const foundFest = HACKTOBERFEST_FESTS_DATA.find(e => e.id === id);
      if (foundFest) return foundFest;
    }
    if (window.hacktoberfestFestsManager && window.hacktoberfestFestsManager.events) {
      const foundFest = window.hacktoberfestFestsManager.events.find(e => e.id === id);
      if (foundFest) return foundFest;
    }
    return null;
  }

  // Pinned Event State Persistence
  getPinnedEventId() {
    return localStorage.getItem(STORAGE_KEYS.PINNED_EVENT);
  }

  setPinnedEventId(id) {
    if (!id) return;
    localStorage.setItem(STORAGE_KEYS.PINNED_EVENT, id);
  }

  clearPinnedEventId() {
    localStorage.removeItem(STORAGE_KEYS.PINNED_EVENT);
  }

  getPinnedEvent() {
    const id = this.getPinnedEventId();
    if (!id) return null;
    const event = this.getEventById(id);
    if (!event) {
      this.clearPinnedEventId();
      return null;
    }
    // If the pinned event has expired, auto-clear it
    if (this.isEventPast(event)) {
      this.clearPinnedEventId();
      return null;
    }
    return event;
  }

  getAllEvents() {
    const festEvents = (window.hacktoberfestFestsManager && window.hacktoberfestFestsManager.events) || [];
    const existingIds = new Set(this.events.map(e => e.id));
    return [...this.events, ...festEvents.filter(e => !existingIds.has(e.id))];
  }

  /**
   * Universal dynamic event lifecycle evaluator
   * Evaluates real-time expiration without manual database edits
   */
  isHacktoberfestActive(now = new Date()) {
    // Hacktoberfest concludes on Nov 1, 2026 00:00:00 IST
    const hfEndMs = new Date('2026-11-01T00:00:00+05:30').getTime();
    return now.getTime() < hfEndMs;
  }

  isEventPast(evt, now = new Date()) {
    if (!evt) return true;
    if (evt.status === 'past') return true;
    const nowMs = now.getTime();
    if (evt.endDate) {
      return nowMs >= new Date(evt.endDate).getTime();
    }
    if (evt.targetDate) {
      return nowMs >= new Date(evt.targetDate).getTime();
    }
    return false;
  }

  isEventOngoing(evt, now = new Date()) {
    if (!evt || this.isEventPast(evt, now)) return false;
    if (evt.isOngoing || evt.status === 'ongoing') return true;
    if (evt.startDate && evt.endDate) {
      const nowMs = now.getTime();
      const startMs = new Date(evt.startDate).getTime();
      const endMs = new Date(evt.endDate).getTime();
      return nowMs >= startMs && nowMs < endMs;
    }
    return false;
  }

  isEventUpcoming(evt, now = new Date()) {
    return !this.isEventPast(evt, now) && !this.isEventOngoing(evt, now);
  }

  getFlagshipEvent() {
    const now = new Date();
    // 1. Prioritize designated unexpired flagship event (e.g. AIDN Hack Day until Nov 1st)
    const flagship = this.events.find(e => e.isFlagship && !this.isEventPast(e, now));
    if (flagship) return flagship;

    // 2. Fallback flagship candidate: ETHIndia 2026 takes over once Hacktoberfest ends
    const ethindia = this.events.find(e => e.id === 'evt-ethindia-2026' && !this.isEventPast(e, now));
    if (ethindia) return ethindia;

    // 3. Any active ongoing event
    const ongoing = this.events.find(e => this.isEventOngoing(e, now));
    if (ongoing) return ongoing;
    
    // 4. Otherwise get earliest upcoming unexpired event
    const upcoming = this.events
      .filter(e => !this.isEventPast(e, now))
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
      
    return upcoming.length > 0 ? upcoming[0] : (this.events[0] || null);
  }

  setFlagshipEvent(id) {
    this.events.forEach(e => {
      e.isFlagship = (e.id === id);
    });
    this.save(STORAGE_KEYS.EVENTS, this.events);
    return this.getEventById(id);
  }

  awardStudentXp(studentId, amount = 200) {
    const student = this.students.find(s => s.id === studentId || s.studentId === studentId);
    if (!student) return null;
    student.devXp = (student.devXp || 0) + amount;
    student.level = Math.floor(student.devXp / 300) + 1;
    this.save(STORAGE_KEYS.STUDENTS, this.students);
    if (this.currentUser && (this.currentUser.id === student.id || this.currentUser.studentId === student.studentId)) {
      this.currentUser = student;
      this.save(STORAGE_KEYS.USER, this.currentUser);
    }
    return student;
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
