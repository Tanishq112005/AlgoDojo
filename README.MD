# AlgoDojo

[![GitHub issues](https://img.shields.io/github/issues/Tanishq112005/AlgoDojo)](https://github.com/Tanishq112005/Test_app/issues) [![GitHub forks](https://img.shields.io/github/forks/Tanishq112005/AlgoDojo)](https://github.com/Tanishq112005/AlgoDojo/network/members) [![GitHub stars](https://img.shields.io/github/stars/Tanishq112005/AlgoDojo)](https://github.com/Tanishq112005/AlgoDojo/stargazers)

Welcome to **AlgoDojo**, your personal coding gymnasium for mastering algorithmic challenges.

---

## 🌟 About The Project

**AlgoDojo** is a dual-purpose training platform meticulously crafted for two key audiences: the aspiring **competitive programmer** and the diligent **interview candidate**. It provides a versatile and focused environment to hone your problem-solving skills under realistic, time-constrained conditions.

### 1. For the Competitive Programmer: Sharpen Your Edge
For those looking to climb the ranks on platforms like **Codeforces** and **LeetCode**, AlgoDojo acts as the perfect sparring partner. Move beyond random practice and into the realm of strategic training.

*   **Simulate Real Contests:** Create custom "mashups" of problems from your favorite platforms. This allows you to practice solving a set of diverse problems within a single, timed session, just like in a live contest.
*   **Targeted Practice for Rating Improvement:** The ability to filter problems by specific rating ranges is crucial. You can focus on problems just above your current comfort level to effectively attack your weaknesses, solidify your strengths, and build the intuition needed to solve higher-rated problems.
*   **Perform Under Pressure:** The built-in timer forces you to manage your time effectively, make quick decisions, and debug efficiently—key skills for boosting your performance and improving your rating when it truly matters.

### 2. For the Interview Candidate: Ace Your Technical Interviews
Technical interviews are all about thinking clearly and delivering a working solution under the pressure of the clock. AlgoDojo replicates this high-stakes environment, allowing you to build the confidence and composure needed to succeed.

*   **Practice in a Realistic Setting:** Solve LeetCode-style and Codeforces-style problems within a set time limit, mirroring the conditions of a typical online assessment or a live coding interview round. This helps you get accustomed to the pressure and manage your nerves.
*   **Build Problem-Solving Muscle:** By repeatedly practicing in a timed setting, you reduce anxiety and train your brain to stay focused on the logic, even when the clock is ticking.
*   **Master the Clock:** Learn to pace yourself, allocate time for understanding the problem, coding the solution, and testing it—all within the interview's constraints.

Whether you are aiming for a new rating milestone or preparing to land your dream job, **AlgoDojo** provides the structured practice you need to achieve your goals.

---

## 📸 Screenshots


 *Dashboard* 
 ![Dashboard](./images/dashboard.png) 
 
 *Contest Setup*
  ![Contest Setup](./images/test_decider_page.png) 
  
 *Rules Page*
   ![Rules Page](./images/rules_page.png) 
 
 *Practice Arena*
 ![Practice Arena](./images/contest_page2.png) 
 
 *Summary Page*
  ![Summary Page](./images/summary_page.png) 

---

## ✨ Key Features

*   **Problem Aggregator:** Access a vast library of questions from LeetCode and Codeforces.
*   **Custom Contests:** Create your own timed practice sessions.
*   **Difficulty Filtering:** Choose problems based on their rating to match your skill level.
*   **Timed Environment:** A built-in timer to simulate real-world pressure.
*   **User Authentication:** Secure login and registration to track your progress.

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, TypeScript, HTML, CSS
*   **Backend:** Node.js, Express.js, TypeScript
*   **Database:** MongoDB
*   **Authentication:** JSON Web Tokens (JWT)
*   **Web Scraping:** [Puppeteer](https://pptr.dev/) (for gathering problem data)
*   **Containerization:** Docker (Backend deployed on Render)
*   **Email Service:** Brevo (formerly Sendinblue)
*   **Code Execution:** Wandbox API

---

## 🏗️ Architectural Design

AlgoDojo is designed with a modern decoupled architecture. The frontend handles all user interactions and state management, while the backend serves as a robust API gateway for database operations, authentication, web scraping, and external integrations (code execution and emails).

```mermaid
graph TD
    %% Define styles
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    classDef db fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    classDef external fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff

    %% Nodes
    User(("User Browser"))
    FE["Frontend (React / Vite) <br/> Hosted on Vercel"]:::frontend
    BE["Backend (Node / Express) <br/> Hosted on Render Docker"]:::backend
    DB[("MongoDB <br/> Atlas Cluster")]:::db
    
    Wandbox["Wandbox API <br/> (Code Compilation)"]:::external
    Brevo["Brevo API <br/> (OTP Emails)"]:::external
    Puppeteer["Puppeteer <br/> (Problem Scraper)"]:::external

    %% Connections
    User <-->|HTTP/REST| FE
    FE <-->|REST API| BE
    
    BE <-->|Mongoose| DB
    BE -->|Axios POST| Wandbox
    BE -->|Axios POST| Brevo
    BE -->|Headless Chrome| Puppeteer
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/en/) (which includes npm)
*   [Git](https://git-scm.com/)
*   [TypeScript](https://www.typescriptlang.org/download) and [ts-node](https://www.npmjs.com/package/ts-node) installed globally. If not, run:
    ```bash
    npm install -g typescript ts-node
    ```

### Installation

1.  **Fork the repository** by clicking the "Fork" button at the top right of this page.

2.  **Clone your forked repository** (replace `YOUR_USERNAME` with your GitHub username):
    ```bash
    git clone https://github.com/YOUR_USERNAME/AlgoDojo.git
    cd AlgoDojo
    ```

3.  **Set up the Frontend:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    ```

### Environment Configuration

The project requires some environment variables to be set up.

#### 1. Backend `.env` File
In the `backend` directory, create a new file named `.env` and add the following content:
```env
PORT_NUMBER=8000
MONGO_DB=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
COMPANY_MAIL=your_verified_brevo_email_address
BREVO_API_KEY=your_brevo_api_key
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

### **How to get these values:**
*   **`PORT_NUMBER`**: The port on which your backend server will run (e.g., 8000).
*   **`MONGO_DB`**: Your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Make sure to include the database name (e.g., `...mongodb.net/test?...`).
*   **`JWT_SECRET`**: A long, random, and secret string for signing authentication tokens.
*   **`COMPANY_MAIL`**: The email address you verified on your Brevo account to send OTPs.
*   **`BREVO_API_KEY`**: Get your v3 API key from your [Brevo Dashboard](https://app.brevo.com/settings/keys/api).
*   **`PUPPETEER_EXECUTABLE_PATH`**: The path to your Chrome installation. Use `/usr/bin/google-chrome` if deploying on Linux/Render via Docker, or your local path (e.g., `C:\Program Files\Google\Chrome\Application\chrome.exe`) for local Windows testing.

#### 2. Frontend Configuration
For the frontend to communicate with the backend, you need to set the backend URL.
1.  Navigate to the `frontend/src/keys/` directory.
2.  Open the file that contains the backend URL variable (e.g., `links.ts`).
3.  Find the `BACKEND_URL` variable and replace its value with your local backend address, using the port you set in the `.env` file.
    ```typescript
    // Example in a file like frontend/src/keys/links.ts
    export const BACKEND_URL = 'http://localhost:8000/';
    ```

### Running the Application

Follow these steps to run the project after completing the installation and configuration.

#### 1. Start the Backend Server
You have two options for running the backend:

**Option A: For Development (using `ts-node`)**
This method runs the TypeScript code directly, which is useful when you are actively developing.
1.  Navigate into the `backend/src` directory:
    ```bash
    cd backend/src
    ```
2.  Run the server using `ts-node`:
    ```bash
    ts-node index.ts
    ```
    The server should now be running in development mode on `http://localhost:PORT_NUMBER`.

**Option B: For Production (using compiled JavaScript)**
This method runs the standard, compiled JavaScript code, which is faster and how it would run on a live server.
1.  First, compile your TypeScript code. From the main `backend` directory, run:
    ```bash
    tsc -b
    ```
    This creates a `dist` folder containing the compiled `.js` files.

2.  Navigate into the newly created `dist` folder:
    ```bash
    cd backend/dist
    ```

3.  Run the application using Node.js:
    ```bash
    node index.js
    ```
    The server should now be running in production mode on `http://localhost:PORT_NUMBER`.

#### 2. Start the Frontend Development Server
1.  In a **separate terminal window**, navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open your browser and go to the URL provided (usually `http://localhost:5173`).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📬 Contact

1. Tanishq - [@Tanishq112005](https://github.com/Tanishq112005)  
2. email -(algodojo1@gmail.com)
3. Project Link: [https://github.com/Tanishq112005/AlgoDojo](https://github.com/Tanishq112005/AlgoDojo)
4. live-project-on : [AlgoDojo](algodojo.vercel.app) 
5. linkedin : [Tanishq Jain](https://www.linkedin.com/in/tanishq-jain-6b90b1292/) 