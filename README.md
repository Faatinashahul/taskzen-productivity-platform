# TaskZen

### A Modern Task Management & Productivity Platform

TaskZen is a full-stack productivity application designed to help users efficiently manage tasks, monitor deadlines, organize notes, and track progress through an intuitive Kanban-based workflow.

The platform combines task organization, deadline planning, productivity analytics, note management, and activity tracking into a single unified workspace, enabling users to stay focused and productive.

---
### DEPLOYED AND CONTAINERISED:
 https://taskzen-frontend-748989955455.us-central1.run.app

## Overview

Managing multiple responsibilities across academics, work, and personal projects can quickly become overwhelming. Existing solutions are often either too complex or lack the features required for effective planning and productivity monitoring.

TaskZen addresses these challenges by providing:

* Structured task organization
* Deadline-aware planning
* Productivity analytics
* Secure user authentication
* Activity tracking
* Centralized task management

Built using modern web technologies, TaskZen offers a responsive and user-friendly experience while maintaining scalability and security.

---

## Key Features

### Secure Authentication

* User Registration & Login
* JWT-based Authentication
* Protected API Routes
* Session Persistence

### Kanban Task Management

* Create, Edit, Delete Tasks
* Drag-and-Drop Task Movement
* Multiple Boards Support
* Task Status Tracking

### Smart Planner

* Automatic Categorization of Tasks:

  * Overdue
  * Due Today
  * Upcoming
* Deadline Monitoring
* Centralized Planning Dashboard

### Productivity Analytics

* Total Tasks Overview
* Completion Statistics
* Task Progress Tracking
* Productivity Insights

### Notes Workspace

* Quick Notes Creation
* Color-Coded Notes
* Personal Knowledge Management

### Activity Tracking

* Task Creation History
* Task Updates Monitoring
* Task Movement Logs
* User Activity Timeline

---

## System Architecture

```text
┌──────────────────────────┐
│        Frontend          │
│      React + Vite        │
└────────────┬─────────────┘
             │
             │ REST API Calls
             ▼
┌──────────────────────────┐
│         Backend          │
│    Node.js + Express     │
└────────────┬─────────────┘
             │
             │ SQL Queries
             ▼
┌──────────────────────────┐
│        Database          │
│          MySQL           │
└──────────────────────────┘
```

The application follows a three-tier architecture:

1. Presentation Layer – React-based user interface
2. Application Layer – Express server handling business logic
3. Data Layer – MySQL database managing persistent storage

Authentication is implemented using JWT tokens and middleware-based authorization.

---

## Technology Stack

### Frontend

* React.js
* Vite
* Axios
* React Hooks
* @hello-pangea/dnd
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MySQL

### Development Tools

* Git
* npm
* VS Code

---

## Project Structure

```text
TaskZen
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── database_schema.sql
├── package.json
├── package-lock.json
└── README.md
```

---

## Database Design

The system is built around the following core entities:

### User Management

* Users

### Task Management

* Boards
* Columns
* Tasks
* Checklist Items

### Productivity Modules

* Notes
* Activity Logs

Relationships are maintained through foreign key constraints to ensure data integrity and consistency.

---

## Installation Guide

### Clone the Repository

```bash
git clone https://github.com/Faatinashahul/taskzen.git
cd taskzen
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../Server
npm install
```

---

## Environment Configuration

Create a `.env` file inside the `Server` directory:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_db

JWT_SECRET=your_secret_key
```

---

## Database Setup

Create the database:

```sql
CREATE DATABASE task_db;
```

Import the schema:

```bash
mysql -u root -p task_db < database_schema.sql
```

---

## Running the Application

### Start Backend Server

```bash
cd Server
npm start
```

Backend will run on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## API Modules

### Authentication

* User Registration
* User Login
* User Information Retrieval

### Boards

* Create Board
* Retrieve Boards
* Delete Board

### Tasks

* Create Task
* Retrieve Tasks
* Move Tasks Between Columns
* Reorder Tasks
* Delete Tasks

### Notes

* Create Notes
* Retrieve Notes
* Delete Notes

### Activity

* Retrieve User Activity Logs

---

## Core Modules

### Landing Page

A modern onboarding experience introducing TaskZen and its features.

### Authentication

Secure registration and login workflow using JWT authentication.

### Boards

Kanban-style boards with drag-and-drop functionality for managing tasks.

### Planner

Deadline-focused dashboard that categorizes tasks as Overdue, Due Today, or Upcoming.

### Analytics Dashboard

Visual insights into productivity through completion statistics and progress tracking.

### Notes

Color-coded note management system for quick idea capture and organization.

### Activity Tracker

Detailed timeline of user actions and task-related events.

---

## Future Enhancements

* Cloud Deployment (AWS, Azure, Google Cloud)
* Real-Time Collaboration
* Shared Boards and Workspaces
* Role-Based Access Control
* Push Notifications
* Mobile Application
* AI-Powered Task Recommendations
* Predictive Productivity Analytics

---

## Learning Outcomes

Through the development of TaskZen, we gained practical experience in:

* Full-Stack Web Development
* RESTful API Design
* JWT Authentication & Authorization
* Database Design and Management
* React State Management
* Client–Server Architecture
* CRUD Operations
* Secure Application Development
* Software Deployment Workflows

---

## Contributors

### Faatina S

Backend Developer

* Database Design
* JWT Authentication
* REST API Development
* Server-Side Logic

### Anushya V

Frontend Developer

* User Interface Design
* Planner Module
* Board Management
* Drag-and-Drop Integration

---

## Academic Information

**Project:** TaskZen – Task Management & Productivity Tool
**Course:** UCS2601 – Internet Programming
**Department:** Computer Science and Engineering
**Institution:** SSN College of Engineering
**Academic Year:** 2025–2026

---

## License

This project was developed for academic and educational purposes as part of the Internet Programming course at SSN College of Engineering.
