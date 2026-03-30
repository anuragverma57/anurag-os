/**
 * Personal site copy — update here as your journey evolves.
 */

export const site = {
  name: "Anurag Verma",
  title: "Backend Software Developer",
  tagline:
    "Backend-focused engineer building scalable systems and RESTful APIs in Go and Node.js. I care about performance, solid data modeling, and shipping services that stay reliable in production—from high-throughput cab platforms to automation for large deployments.",
  location: "Lucknow, India",
  email: "anurag.av57@gmail.com",
  github: "https://github.com/anuragverma57",
  linkedin: "https://www.linkedin.com/in/anurag-verma-57a508231",
  resumeUrl: "/AnuragVerma_Resume.pdf",
};

export const aboutParagraphs = [
  "I’m a Software Developer at RBH Solutions, working on backend and full-stack delivery for enterprise and government platforms—including the HVPNL substation automation initiative—where I collaborate with stakeholders, align with cross-functional teams, and support production. A recent win: optimizing a critical backend task from roughly fifteen minutes down to seconds through better algorithms and query design.",
  "Earlier I interned at Flix Logix (Triply Cabs), where I built and maintained 30+ REST APIs in Go (Echo) with Redis and ArangoDB for a multi-role cab product—OTP auth, live tracking, geo-fencing, and route optimization. At Zalco Technologies, I worked on a real-time messaging backend (Express, TypeScript, Socket.io) with MongoDB performance work that included schema refactors and indexing.",
  "I graduated with a B.Tech from NIT Srinagar (2025). I’ve solved 200+ LeetCode problems, earned freeCodeCamp’s JavaScript Algorithms & Data Structures certification, and I’m building Anurag OS—my personal hub for notes, prep, and this portfolio.",
];

export type Project = {
  title: string;
  description: string;
  stack: string[];
  href: string;
  repo?: string;
  linkLabel?: string;
  /** Renders as a wide “hero” card on large screens */
  featured?: boolean;
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Software Developer",
    company: "RBH Solutions Pvt. Ltd.",
    location: "Patiala, India · On-site",
    start: "Oct 2025",
    end: "Present",
    current: true,
    highlights: [
      "Optimized a critical backend job from ~15 minutes to seconds via algorithm and query changes.",
      "Delivered a government enterprise module (Angular, .NET, PostgreSQL, CouchDB, SignalR) with real-time workflows.",
      "Worked with stakeholders, cross-functional teams, and on-site production support.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Flix Logix India (Triply Cabs)",
    location: "Remote",
    start: "Jan 2024",
    end: "Jul 2024",
    highlights: [
      "Built 30+ REST APIs in Go (Echo) with Redis and ArangoDB for a multi-role cab platform.",
      "Shipped OTP authentication, live tracking, geo-fencing, and route optimization.",
      "Collaborated in an agile team; authored API docs for onboarding.",
    ],
  },
  {
    role: "Backend Developer Intern",
    company: "Zalco Technologies",
    location: "Remote",
    start: "May 2023",
    end: "Dec 2023",
    highlights: [
      "Real-time messaging backend (Express, TypeScript, Socket.io) for 100+ concurrent users.",
      "Improved MongoDB performance ~32% via schema refactors and compound indexes.",
      "Features: attachments, broadcast, blocking, chat deletion, and more.",
    ],
  },
  {
    role: "B.Tech — Computer Science & Engineering",
    company: "National Institute of Technology, Srinagar",
    location: "Srinagar, India",
    start: "2021",
    end: "2025",
    highlights: ["CGPA 7.67 · Coursework: DSA, DBMS, CN, OOPs, OS", "Built this portfolio and Anurag OS alongside coursework."],
  },
];

export const projects: Project[] = [
  {
    title: "Anurag OS",
    featured: true,
    description:
      "My personal operating system: portfolio, structured learning, and prep tracking in one place—single admin, public read-only surface, private dashboard as it grows.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    href: "https://github.com/anuragverma57/anurag-os",
    repo: "https://github.com/anuragverma57/anurag-os",
    linkLabel: "Repository",
  },
  {
    title: "Yo-chat (real-time chat)",
    description:
      "Real-time chat application work spanning WebSockets-style messaging, live updates, and a deployable client—aligned with my early backend focus on concurrency and live systems.",
    stack: ["JavaScript", "Node.js", "Real-time"],
    href: "https://github.com/anuragverma57/yochat.github.io",
    repo: "https://github.com/anuragverma57/chat-app",
    linkLabel: "Live project",
  },
  {
    title: "Inventory Management System",
    description:
      "Full-stack inventory system for catalog, stock, suppliers, and transaction history with role-based access—backend services with clear domain boundaries, caching, optimized access patterns, and containerized deployment.",
    stack: ["Go", "FastAPI", "Nest.js", "Next.js", "PostgreSQL", "Redis", "Kubernetes"],
    href: "/AnuragVerma_Resume.pdf",
    linkLabel: "Résumé (overview)",
  },
];
