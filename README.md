# Smart File Vault - Frontend

This is the React-based frontend for the Smart File Vault application. It provides the user interface for authentication, file management, and interaction with the secure backend.

---

## 🚀 Getting Started

To run the frontend locally, follow these steps:

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

**Note:** The backend server must be running for the frontend to function correctly. The frontend uses a proxy to forward API requests to the backend at `http://localhost:5000`.

---

## 📦 Key Dependencies

-   **`react`**: A JavaScript library for building user interfaces.
-   **`react-router-dom`**: For handling routing and navigation within the single-page application.
-   **`axios`**: A promise-based HTTP client for making requests to the backend API.
-   **`@mui/material`**: A popular React UI framework that provides a suite of customizable components for a modern and responsive design.

---

## 🏛️ Project Structure

The `src` directory is organized as follows:

-   **/components**: Contains reusable React components that are used across different pages (e.g., `FileUpload`, `FileList`).
-   **/pages**: Contains top-level components that represent the main pages of the application (e.g., `LoginPage`, `DashboardPage`).
-   **/services**: Contains modules for handling external services, primarily the `api.js` file for `axios` configuration.
-   **`App.js`**: The main application component that sets up routing.
-   **`index.js`**: The entry point of the React application.

---

## ✨ Core Features

-   **User Authentication**:
    -   Separate pages for user **Sign Up** and **Login**.
    -   Handles JWT (JSON Web Token) based authentication. The token is stored in `localStorage` upon successful login.
    -   An `axios` interceptor automatically attaches the auth token to the header of every protected API request.
-   **Protected Routes**: The main dashboard is a protected route. Unauthenticated users are automatically redirected to the login page.
-   **Dashboard**:
    -   The central hub for authenticated users.
    -   Displays a list of all user-uploaded files.
-   **File Operations**:
    -   **Upload**: Users can select and upload files, which are sent securely to the backend. An upload progress bar provides real-time feedback.
    -   **Download**: Users can download their files with a single click.
    -   **Share**: Generate a 24-hour expiring shareable link for any file. The link is displayed in a modal for easy copying.
    -   **Delete**: Users can delete their files after a confirmation prompt to prevent accidental data loss.
-   **Responsive UI**: The interface is built with Material-UI to be responsive and user-friendly across different devices.
