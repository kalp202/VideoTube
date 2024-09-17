# Videotube: Backend for YouTube-like Video Streaming Service

Videotube is a backend for a video streaming platform, similar to YouTube, built using Node.js, Express.js, and MongoDB. It provides the necessary infrastructure for video uploads, streaming, user management, and content interactions.

## Features

- **Video Upload & Streaming**: Users can upload videos with thumbnails and stream them on the platform.
- **User Channels**: Create and manage channels with profile and cover photos.
- **Subscriptions**: Users can subscribe to channels and view their subscriptions.
- **Likes & Comments**: Engage with video content through likes and comments.
- **Community Posts**: Users can create and share posts in the community section.
- **User Authentication**: Secure JWT-based authentication for login and registration.
- **Media Management**: Multer is integrated for handling media file uploads.
- **MongoDB Integration**: Stores user, video, and comment data.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer (for managing video and image uploads)

## Installation

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd videotube-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:

4. **Run the server**:
    ```bash
    npm start
    ```

## Usage

1. **User Registration & Login**:
   - **Register**: Create a new account with a username and password.
   - **Login**: Access your account using your credentials.

2. **Account Management**:
   - **Create/Update Profile**: Add or update your profile with a cover image and profile photo.
   - **Upload Videos**: Upload videos to your channel with relevant details.
   - **Manage Subscriptions**: Subscribe to other channels and manage your subscriptions.

3. **Interact with Content**:
   - **Likes & Comments**: View likes on your videos and interact with comments.
   - **Community Posts**: Create and manage posts within the community section.

## API Endpoints

- **/api/auth**: Handles user registration and login.
- **/api/users**: User and profile management.
- **/api/videos**: Video upload, streaming, and management.
- **/api/channels**: Channel creation and management.
- **/api/subscriptions**: Manage user subscriptions.
- **/api/comments**: Like, comment, and interact with videos.
- **/api/posts**: Community post management.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and make a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, feel free to contact **Kalp Patel** at **kalppatel2024@gmail.com**.
