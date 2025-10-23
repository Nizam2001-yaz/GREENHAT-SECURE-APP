
GreenHat Secure

Welcome to GreenHat Secure — a playful, hacker‑vibe learning platform that helps students go from zero to pro in cybersecurity. Users pick a dream role (SOC Analyst, Pentester, CISO, etc.), and HatBot — an intelligent in‑app assistant — generates a personalised roadmap, daily tasks, quizzes, labs, resume help and AI-driven job market insights. This repository contains the source code, documentation and deployment guides for the GreenHat Secure app.

Table of contents

Features


Tech stack

Architecture

 (developer setup)

Environment Variables

Running locally

Testing

Deployment

Data model & API summary

Security & Privacy

Contributing

Roadmap

License

Contact / Support

Features

Dark hacker / neon‑green UI and polished app icon (GreenHat logo).

Registration & login (email + password; phone optional) with validation and captcha.

HatBot — AI assistant with a conversational interface and global search.

Role selection (SOC Analyst, Security Analyst, Pentester, Incident Responder, GRC, Compliance, CISO, Cloud Sec, Forensics, etc.).

Role‑based Interactive Career Roadmaps (timeline, milestones, certifications, sample projects, study plan).

“Fast track / Balanced / Part‑time” roadmap modes that adapt estimated time & milestones.

Curriculum hub: fundamentals → advanced (networking, Linux, web app sec, cloud sec, forensics, GRC, crypto, etc.).

Hands‑on labs + progress tracking.

Daily To‑Do tasks automatically generated from roadmap; manual editing + scheduling.

Quiz engine with role-specific 50‑question mock packs and explanations.

AI resume assistant that generates ATS‑friendly resumes tailored to the selected role and user profile.

Role‑based job market insights (skills in demand, salary ranges by country, trending certs).

Motivational quote toasts and gamification: XP, badges, streaks.

Profile, settings, offline reading, privacy controls and data export.
Tech stack 

Use or adapt these — the project is modular so you can replace pieces.

Frontend

React (Vite or Next.js)

Tailwind CSS for styling (neon / hacker theme)

TypeScript

React Query / SWR for data fetching

Local storage + IndexedDB for offline reading/tasks

i18n support (optional)

Backend

Node.js + Express (or NestJS)

TypeScript

PostgreSQL (primary persistent store) or MongoDB for flexible content

Redis for sessions, caching, rate limiting

JWT for auth, bcrypt for password hashing

REST API (or GraphQL) for client-server communication

AI & Search

HatBot: pluggable adapter architecture to swap AI providers (OpenAI, Anthropic, etc.).

Full‑text search with ElasticSearch or Postgres tsvector.

DevOps

Docker + Docker‑Compose for local dev

CI: GitHub Actions (linting, tests, build)

Deployment: Vercel (frontend) + Heroku / AWS ECS / DigitalOcean App Platform (backend) OR a single container on VPS.

Monitoring: Sentry, Prometheus + Grafana (optional)

Architecture

Client (React): UI, HatBot chat UI, search, roadmap UX, quizzes, offline sync.

API (Express): authentication, user profiles, roadmaps generator, quiz engine, resume generator, analytics.

AI Adapter: a backend service that routes conversation to configured AI provider and caches responses.

Data Stores: relational DB for users/content, object store (S3) for media, Redis for cache.

Worker queue: background jobs for resume PDF generation, email sending, heavy AI requests.
License

This project is released under the MIT License. See LICENSE for details.

Acknowledgements


Inspired by learners, hackers, and the open source community.
