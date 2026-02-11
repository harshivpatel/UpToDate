# UpToDate – News Aggregator Application

UpToDate is a full-stack web application that allows users to browse, search, and save the latest news articles from multiple sources in real time.

It integrates :contentReference[oaicite:0]{index=0} through a secure :contentReference[oaicite:1]{index=1} backend and provides a responsive :contentReference[oaicite:2]{index=2} frontend with user authentication and bookmarking features.

---

## Features

- Search news articles by keyword or category  
- Filter news by topics such as technology, sports, and business  
- Bookmark and save articles per user  
- JWT-based user authentication (Register / Login)  
- Dark mode support  
- Secure backend API with environment variables  
- Responsive Angular UI  
- Optional Docker support for local deployment  

---

## Tech Stack

| Layer | Technologies |
|------|-------------|
| Frontend | Angular 19, TypeScript, Bootstrap |
| Backend | Node.js, Express.js |
| Database | :contentReference[oaicite:3]{index=3}, Mongoose |
| Authentication | JWT, bcrypt |
| External API | NewsAPI |
| Tools | Git, Docker, Postman |

---

## 🛠 Installation & Local Setup

Follow these steps to run **UpToDate** locally.

---

### Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm (comes with Node.js)
- Angular CLI
- MongoDB (local or Atlas)

Install Angular CLI globally:

```bash
npm install -g @angular/cli
