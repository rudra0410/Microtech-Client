# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for your IoT Admin Panel.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Firebase CLI installed (optional, for advanced setup)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "iot-admin-panel")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</>) 
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Create a `.env` file in the `client` directory
2. Copy the contents from `.env.example`
3. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Set Up Firestore Security Rules

In the Firestore console, go to "Rules" and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own admin profile
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to read other admin profiles (for admin management)
    match /admins/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Add more rules for other collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Initialize Sample Data (Optional)

To populate your Firestore with sample admin data:

1. Uncomment the last line in `src/scripts/setupFirebase.ts`
2. Run the setup script:
   ```bash
   npm run dev
   ```
3. Open browser console and the script will create sample admin users
4. Comment out the line again after running once

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try logging in with the demo credentials:
   - Email: `admin@iotadmin.com`
   - Password: `admin123`

## Default Demo Accounts

After running the setup script, you'll have these demo accounts:

- **Owner**: admin@iotadmin.com / admin123
- **Admin**: sarah.johnson@iotadmin.com / admin123  
- **Support**: mike.wilson@iotadmin.com / admin123

## Troubleshooting

### Common Issues:

1. **"Firebase config not found"**
   - Make sure your `.env` file is in the `client` directory
   - Verify all environment variables are set correctly
   - Restart your development server

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Ensure the user is authenticated
   - Verify the user has the correct permissions

3. **"User not found" after login**
   - Make sure the admin document exists in Firestore
   - Check that the document ID matches the Firebase Auth UID
   - Run the setup script to create sample data

4. **Authentication errors**
   - Verify Email/Password provider is enabled in Firebase Console
   - Check that the email format is correct
   - Ensure the password meets Firebase requirements (6+ characters)

## Production Considerations

Before deploying to production:

1. **Update Firestore Rules**: Make them more restrictive based on your needs
2. **Environment Variables**: Use production Firebase project config
3. **Password Policy**: Implement stronger password requirements
4. **User Management**: Set up proper admin user creation flow
5. **Backup Strategy**: Configure Firestore backups
6. **Monitoring**: Set up Firebase monitoring and alerts

## Next Steps

- Set up Firebase Functions for server-side logic
- Implement real-time listeners for live data updates
- Add Firebase Storage for file uploads
- Set up Firebase Hosting for deployment
- Configure Firebase Analytics for usage tracking