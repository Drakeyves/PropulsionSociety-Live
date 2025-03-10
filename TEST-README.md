# PropulsionSociety Live - Bug Fix Testing

This directory contains tools and instructions for testing the bug fixes implemented in the PropulsionSociety Live platform.

## Automated Testing Script

The `test-bug-fixes.js` script helps verify that the bug fixes are working correctly. It provides automated tests for some fixes and manual testing instructions for others.

### Prerequisites

- Node.js 16+
- Running development server (`npm run dev`)
- Database connection configured in `.env`

### Installation

1. Make sure you have the required dependencies:
   ```bash
   npm install node-fetch @prisma/client
   ```

2. Run the test script:
   ```bash
   node test-bug-fixes.js
   ```

### What the Script Tests

The script tests the following bug fixes:

1. **Database Connection (Bug #3)**
   - Runs multiple concurrent database queries to verify connection pooling
   - Measures performance to ensure connections are stable

2. **User Authentication Setup (Bug #5)**
   - Creates test users if needed
   - Provides instructions for manual testing of session persistence

3. **Post Sharing API Setup (Bug #4)**
   - Creates test posts if needed
   - Sets up the environment for testing post sharing functionality
   - Provides test data for manual testing

## Manual Testing Instructions

For comprehensive testing of all bug fixes, follow these manual testing instructions:

### Testing SharePostModal Component (Bug #1)

1. Log in to the application
2. Navigate to a post detail page
3. Click the "Share" button to open the SharePostModal
4. Verify that the modal opens correctly and displays user selection dropdown
5. Select a user and optionally add a message
6. Click "Share" and verify that the post is shared successfully

### Testing SharedPostMessage Component (Bug #2)

1. Share a post with another user using the steps above
2. Log in as the recipient user
3. Navigate to the messages section
4. Verify that the shared post appears with a preview
5. Click on the shared post to navigate to the full post

### Testing Database Connection (Bug #3)

1. Run the application in development mode
2. Perform multiple database operations in quick succession
3. Monitor the console for any database connection errors
4. Let the application run for an extended period to verify long-term stability

### Testing Post Sharing API (Bug #4)

1. Share a post without providing a message
2. Share a post with a message
3. Verify that both operations complete successfully
4. Check the database to ensure the message field is properly stored

### Testing Session Expiration (Bug #5)

1. Log in to the application
2. Leave the application open for more than 30 minutes
3. Periodically interact with the application (click, type)
4. Verify that you remain logged in
5. Test by opening the application in multiple tabs

## Troubleshooting

If you encounter issues during testing:

1. Check the console for error messages
2. Verify that your database connection string includes the connection pooling parameters
3. Ensure that all components are properly imported in their respective files
4. Check that the NextAuthProvider and SessionRefresh components are included in the root layout

For detailed bug descriptions and solutions, refer to the [READMEBUGLOG.md](./READMEBUGLOG.md) file. 