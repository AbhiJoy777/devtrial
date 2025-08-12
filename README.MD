# DevTrial – Interview Practice Simulator

DevTrial is a peer-to-peer web application designed to help software developers practice for technical interviews. It provides a real-time, collaborative environment where users can take turns acting as the interviewer and the candidate, solving coding problems together.

 <!-- Optional: Add a screenshot of your app -->

## How It Works

The application creates a seamless interview experience. A user logs in and is taken to their dashboard. From there, they can enter a matchmaking lobby to be paired with another user. Once a "candidate" and an "interviewer" are matched, they are placed into a shared, private interview room.

In the room, they have a synchronized code editor, a shared timer, and a video chat panel. The candidate codes the solution to a randomly selected problem while the interviewer observes and provides guidance, simulating a real-world technical screen.

---

## Key Features

-   **Real-time Collaborative Code Editor**: Code syncs instantly between users.
-   **Peer-to-Peer Video Chat**: Direct, low-latency video communication.
-   **Automated Matchmaking**: Users select a role (Interviewer/Candidate) and are automatically paired.
-   **Question Bank**: A curated list of questions fetched from a database for each session.
-   **Live Timer**: A synchronized timer to keep the interview session on track.
-   **Secure User Authentication**: Users can sign up and log in to their accounts.

---

## Tech Stack

This project is a full-stack MERN application with real-time capabilities.

#### **Frontend (Client)**

-   **React**: A JavaScript library for building the user interface.
-   **Vite**: A modern, fast build tool for frontend development.
-   **CodeMirror**: An in-browser code editor with syntax highlighting.
-   **Socket.IO Client**: Manages the real-time WebSocket connection to the server.
-   **Simple-Peer**: A library to simplify WebRTC for peer-to-peer video.
-   **React Router**: For client-side routing.
-   **Axios**: For making HTTP requests to the backend API.

#### **Backend (Server)**

-   **Node.js**: A JavaScript runtime for the server.
-   **Express**: A web application framework for Node.js, used to build the REST API.
-   **MongoDB**: A NoSQL database used to store user data and the question bank.
-   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **Socket.IO**: Enables real-time, bidirectional, and event-based communication.
-   **JSON Web Tokens (JWT)**: For secure user authentication.
-   **bcrypt.js**: For hashing user passwords.

---

## Local Setup and Installation

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/devtrial.git
    cd devtrial
    ```

2.  **Setup the Backend Server:**
    -   Navigate to the server directory: `cd server`
    -   Install dependencies: `npm install`
    -   Create a `.env` file in the `server` directory and add your variables:
        ```
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```
    -   Start the server: `npm run dev`
    -   The server will be running on `http://localhost:5000`.

3.  **Setup the Frontend Client:**
    -   Open a new terminal and navigate to the client directory: `cd client`
    -   Install dependencies: `npm install`
    -   Start the client: `npm run dev`
    -   The application will be available at `http://localhost:5173`.