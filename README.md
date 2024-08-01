# Aries E-commerce Website

ARIES is a modern e-commerce platform for stylish clothing and accessories, offering a seamless shopping experience with a curated selection of high-quality products. Built with modern web technologies, this project leverages React.js for the frontend, Firebase for authentication, storage, and Firestore database, along with various other tools and libraries for an optimal development experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User Authentication with Firebase
- Secure Storage and Retrieval of User Data
- Firestore for Database Management
- Responsive Design with Vanilla CSS
- Rich User Interface with React Icons
- Real-time Data Queries

## Technologies Used

- [React.js](https://reactjs.org/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [React Icons](https://react-icons.github.io/react-icons/)
- [npm](https://www.npmjs.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed:
- Node.js (>= 14.0.0)
- npm (>= 6.0.0)
- Firebase CLI

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:PaulFranciz/Aries.git
   ```
2. Navigate to the project directory
   ```sh
   cd Aries
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

## Usage

1. Start the development server
   ```sh
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Authentication and choose the sign-in methods you want to support.
3. Create a Firestore database.
4. Set up Firebase Storage if needed.
5. Obtain your Firebase configuration and add it to your project as an environment variable.
   Create a `.env` file in the root directory and add the following:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production.
- `npm run preview`: Preview the production build locally.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Paul Franciz - [pauledet339@gmail.com](mailto:pauledet339@gmail.com)

Project Link: [https://github.com/PaulFranciz/Aries](https://github.com/PaulFranciz/Aries)
