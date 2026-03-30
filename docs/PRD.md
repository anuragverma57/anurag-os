# 📘 Anurag OS — Product Requirements Document (PRD)

## 1. 🧠 Overview

Anurag OS is a personal developer operating system that serves two purposes:

- A **public portfolio website** to showcase projects, notes, and journey
- A **private admin dashboard** to manage learning, track progress, and control content

The system is designed as a **single-user platform (admin-only control)** with a **read-only public interface**.

---

## 2. 🎯 Objectives

- Build a centralized system for managing personal growth as a backend engineer
- Track preparation (DSA, System Design, Backend)
- Maintain structured notes and learning materials
- Manage daily tasks and goals
- Document interview experiences
- Present a curated and professional portfolio to recruiters

---

## 3. 👤 User Roles

### 3.1 Admin (You)

- Full access to all features
- Can create, edit, delete all content
- Can control what is visible publicly

### 3.2 Public User (Visitor / Recruiter)

- Can only **view selected content**
- No login access
- 

---

## 4. 🧩 Core Features

### 4.1 Public Portfolio

- About section
- Projects showcase
- Selected notes (clean and structured)
- Interview experiences (well-written)
- Optional progress insights (controlled)

---

### 4.2 Admin Dashboard (Private)

Accessible via: /admin

#### Capabilities:

- Add/Edit/Delete notes
- Track DSA/System Design progress
- Manage tasks (Todo system)
- Add interview experiences
- Mark content as public/private
- View analytics (basic)

---

### 4.3 Notes System

- Create notes under categories:
  - DSA
  - System Design
  - Backend
  - Others
- Rich text / markdown support
- Tagging system
- Visibility toggle:
  - Public
  - Private

---

### 4.4 Progress Tracker

- Topic-based tracking:
  - Not Started
  - In Progress
  - Completed
  - Needs Revision
- Category-wise progress
- Optional confidence level
- Last updated timestamp

---

### 4.5 Todo / Task Manager

- Add daily tasks
- Mark complete/incomplete
- Optional priority
- Optional due date

---

### 4.6 Interview Tracker

- Record:
  - Company name
  - Role
  - Date
  - Outcome
- Add detailed experience notes
- Mark as public/private

---

## 5. 🔐 Authentication & Access Control

### 5.1 Login Strategy

- Admin login only
- Entry point: /admin
- No public signup

---

### 5.2 Access Rules

- Only authenticated admin can:
- Write/update/delete data
- Public users:
- Read-only access to selected content

---

### 5.3 Data Protection

- All write operations restricted to admin
- Public content filtered before display

---

## 6. 🌐 System Behavior

### Public Mode

- Default state
- Clean, minimal UI
- No edit options visible

### Admin Mode (after login)

- Dashboard access enabled
- Edit controls visible
- Full system interaction

---

## 7. 🎨 UI/UX Requirements

- Clean and minimal design
- Professional portfolio look
- Smooth transition between public and admin modes
- Clear separation of:
- Viewing
- Editing

---

## 8. 📊 Data Visibility Rules

Each content item must support:

- `isPublic: true/false`

Only `isPublic: true` content is visible on public pages.

---

## 9. 🚀 Future Enhancements

- AI assistant for learning support
- Analytics dashboard (weak areas, trends)
- Search and filtering
- Markdown editor improvements
- Multi-device sync improvements
- Performance optimizations

---

## 10. 📌 Constraints

- Single admin user system
- No multi-user support
- Public users cannot interact with data
- Focus on simplicity in early stages

---

## 11. 🧭 Success Criteria

- Daily usability for admin
- Clean and professional public portfolio
- Ability to track and improve preparation
- Clear differentiation between public and private data

