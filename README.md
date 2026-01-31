# 🌟 Evently: The Future of Event Planning 🚀


<div align="center">

  ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
  ![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot)
  ![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)
  ![PayPal](https://img.shields.io/badge/Payments-PayPal%20Sandbox-00457C?style=for-the-badge&logo=paypal)
  ![AI](https://img.shields.io/badge/AI-OpenRouter%20%2F%20RAG-FF0000?style=for-the-badge&logo=openai)

  **Connect • Plan • Celebrate**
  <br>
  _A Full-Stack Event Management System powered by Artificial Intelligence_
</div>

---

## 📖 Table of Contents
- [✨ About the Project](#-about-the-project)
- [🔥 Key Features](#-key-features)
- [⚙️ System Architecture](#-system-architecture)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📬 Contact](#-contact)

---

## ✨ About the Project

**Evently** is not just another booking app. It is a smart ecosystem that bridges the gap between **Users**, **Vendors**, and **Admins**.

Solved the chaos of manual planning by integrating:
* **🤖 AI Chatbot:** Uses **RAG (Retrieval-Augmented Generation)** to answer questions based on *real-time* database availability.
* **💸 Secure Payments:** Fully functional **PayPal Sandbox** integration for safe transactions.
* **🛡️ Vendor Verification:** Admin-controlled approval system to ensure trust.

---

## 🔥 Key Features

### 👤 User Module
* **Smart Search:** Filter events by category, date, and price.
* **AI Assistant:** Ask "What is the price of the Tech Summit?" and get an instant answer.
* **Booking History:** Track all tickets and download invoices.

### 🏢 Vendor Module
* **Event Creation:** Easy-to-use dashboard to publish events.
* **Analytics:** Track ticket sales and revenue in real-time.
* **Profile Management:** Showcase portfolio images to attract customers.

### 👮 Admin Module
* **Verification System:** Approve or Reject new vendors.
* **Platform Stats:** View total users, bookings, and revenue.

---

## ⚙️ System Architecture

The app follows a robust **Monolithic 3-Tier Architecture**:

1.  **Frontend:** React.js (Vite) communicates via REST APIs (Axios).
2.  **Backend:** Java Spring Boot secures endpoints with JWT and manages logic.
3.  **Database:** MySQL stores relational data (Users, Events, Bookings).
4.  **External Services:** OpenRouter (AI) and PayPal (Payments).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, Axios |
| **Backend** | Java 17, Spring Boot 3.x, Spring Security (JWT), Hibernate |
| **Database** | MySQL 8.0 |
| **AI Integration** | OpenRouter API (Grok / Gemini), RAG Implementation |
| **Payments** | PayPal Sandbox API |
| **Tools** | VS Code, Git, Maven, Postman |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1️⃣ Prerequisites
* **Java JDK 17+**
* **Node.js 18+**
* **MySQL Server**

### 2️⃣ Database Setup
1.  Open MySQL Workbench.
2.  Create a database named `event_management_db`.
    ```sql
    CREATE DATABASE event_management_db;
    ```
3.  (Optional) The app uses `update` mode, so tables will be auto-generated.

### 3️⃣ Backend Setup (Spring Boot)
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Configure `src/main/resources/application.properties`:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    app.paypal.clientId=YOUR_PAYPAL_CLIENT_ID
    app.paypal.clientSecret=YOUR_PAYPAL_SECRET
    app.openrouter.apiKey=YOUR_AI_API_KEY
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### 4️⃣ Frontend Setup (React)
1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 📬 Contact

**Durvesh Manohar Patil**
* **GitHub:** [Durvesh-code](https://github.com/Durvesh-code)
* **Email:** patil.durvesh8668@gmail.com

<div align="center">
  <sub>Built with ❤️ by Durvesh</sub>
</div>
