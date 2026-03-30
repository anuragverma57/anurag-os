# Functional Requirements

## 1. Public Features

- View portfolio (about, projects, notes, interview experiences)
- View only content marked as public
- No login/signup for users
- No edit capabilities

---

## 2. Admin Features

### Authentication

- Admin can log in via `/admin`
- Only one admin account exists

### Notes Management

- Create, edit, delete notes
- Categorize notes
- Mark notes as public/private

### Progress Tracking

- Track topics (DSA, System Design, Backend)
- Update status:
  - Not Started
  - In Progress
  - Completed
  - Needs Revision

### Task Management

- Add tasks
- Mark complete/incomplete
- Delete tasks

### Interview Tracking

- Add interview records
- Add detailed experience
- Mark as public/private

---

## 3. Content Control

- Admin decides visibility of all content
- Public can only access `isPublic = true`

