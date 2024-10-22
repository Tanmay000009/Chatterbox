# Chatterbox
A real-time chat application with end-to-end encryption. Keep your conversations fun and secure!

Chatterbox enables users to engage in secure, real-time conversations using Node.js, Express, and Socket.io. The app ensures privacy with end-to-end encryption and guarantees a smooth chat experience with modern technologies.

## Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features
- Encryption: Every message is encrypted at rest for maximum privacy using non-deterministic encryption.
- Secure Authentication: OAuth and JWT-based authentication for secure access.
- Real-time Communication: Instant messaging powered by Socket.io.
- Multiple Chat Rooms: Engage in one-on-one or group chats seamlessly.
- User Socket Management: Efficiently handles user socket-ids, cleaning up inactive ones and replacing them with new connections on reconnect.

## Upcoming Features
- Mobile Responsive: Works flawlessly on both mobile and desktop browsers.
- User Presence Status: Displays online/offline status of users in real-time.
- Media Upload: Share images in chat with real-time upload and preview functionality.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20.3.0)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation 

## Backend (ChatterBox API)

1. Clone the backend repo

   ```sh
   https://github.com/Tanmay000009/Chatterbox
   ```

2. Change the working directory

   ```sh
   cd Chatterbox
   ```

3. Setup `.env` with `sample.env` as a reference.
> Note: Ensure that ENCRYPTION_KEY is 32 bytes long. Eg: super_strong_key_for_encryption9

5. Install dependencies

   ```sh
   npm i
   ```
   
6. Run development server

   ```sh
   npm run dev
   ```

### Commands

- `npm run dev` - Start the development server.
- `npm run build` - Build the project.
- `npm run start` - Start the production server.

- The server will be accessible at `http://localhost:3000`.

## Frontend (ChatterBox Web)

1. Clone the backend repo

   ```sh
   https://github.com/Tanmay000009/ChatterboxWeb
   ```

2. Change the working directory

   ```sh
   cd ChatterboxWeb
   ```
   
3. Install dependencies

   ```sh
   npm i
   ```
   
4. Run development server

   ```sh
   npm run dev
   ```

### Commands

- `npm run dev` - Start the development server.
- `npm run build` - Build the project.
- `npm run start` - Start the production server.

- The application will be accessible at `http://localhost:3001`.
- For testing purpose use `npm run start`.

---

## How It Works

- **Authentication**: Users authenticate via JWT tokens, allowing secure access to chats. Token validation occurs on every request.
- **Socket Connection**: Chatterbox uses Socket.io to manage real-time messaging. Once authenticated, a secure WebSocket connection is established for the session.
- **Socket Management**: Upon server connection, each user's socket ID is updated, and disconnected sockets are automatically cleaned up.
- **Error Handling**: Gracefully handles errors such as token expiration or WebSocket disconnections.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="https://github.com/Tanmay000009/BILLsolutION#billsolution">back to top</a>)</p>

### Features

- Suports secured authentication for your chats.
- Deletes all of users socket-ids upon server close, as new ones will replace them.
- Realtime chatting.

## Contact

Tanmay Vyas

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Tanmay000009)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tanmay-vyas-09/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:tanmayvyas09@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://drive.google.com/file/d/1lkfmeqseeSwK1GlJHEblz2ZuYzdNBRhm/view?usp=drive_link)
