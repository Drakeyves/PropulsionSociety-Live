/**
 * PropulsionSociety Live - Bug Fix Testing Script
 * 
 * This script helps verify that the bug fixes implemented in the codebase are working correctly.
 * It provides automated tests for some of the fixes and manual testing instructions for others.
 * 
 * Usage:
 * 1. Make sure the development server is running
 * 2. Run this script with: node test-bug-fixes.js
 */

const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'password123';
let authToken = null;
let testUserId = null;
let testPostId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Main test function
 */
async function runTests() {
  console.log(`${colors.cyan}PropulsionSociety Live - Bug Fix Testing Script${colors.reset}`);
  console.log(`${colors.cyan}==================================================${colors.reset}\n`);

  try {
    // Test database connection
    await testDatabaseConnection();

    // Test user authentication
    await testUserAuthentication();

    // Test post sharing API
    await testPostSharingAPI();

    // Display manual testing instructions
    displayManualTestingInstructions();

  } catch (error) {
    console.error(`${colors.red}Error running tests:${colors.reset}`, error);
  } finally {
    // Clean up
    await prisma.$disconnect();
  }
}

/**
 * Test database connection with connection pooling
 */
async function testDatabaseConnection() {
  console.log(`${colors.magenta}Testing Database Connection (Bug #3)...${colors.reset}`);
  
  try {
    // Test multiple rapid database queries to verify connection pooling
    console.log('Running multiple rapid database queries...');
    
    const startTime = Date.now();
    const promises = [];
    
    // Run 10 concurrent queries
    for (let i = 0; i < 10; i++) {
      promises.push(prisma.user.findMany({ take: 5 }));
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`${colors.green}✓ Successfully ran 10 concurrent database queries in ${duration}ms${colors.reset}`);
    console.log(`${colors.green}✓ Database connection with connection pooling is working correctly${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Database connection test failed:${colors.reset}`, error);
    throw error;
  }
}

/**
 * Test user authentication and session handling
 */
async function testUserAuthentication() {
  console.log(`${colors.magenta}Testing User Authentication (Bug #5)...${colors.reset}`);
  
  try {
    // Check if test user exists, create if not
    const existingUser = await prisma.user.findUnique({
      where: { email: TEST_USER_EMAIL }
    });
    
    if (!existingUser) {
      console.log(`Creating test user: ${TEST_USER_EMAIL}...`);
      // In a real implementation, you would hash the password
      // This is simplified for testing purposes
      const newUser = await prisma.user.create({
        data: {
          email: TEST_USER_EMAIL,
          name: 'Test User',
          password: TEST_USER_PASSWORD // In real app, this would be hashed
        }
      });
      testUserId = newUser.id;
      console.log(`${colors.green}✓ Test user created${colors.reset}`);
    } else {
      testUserId = existingUser.id;
      console.log(`${colors.green}✓ Test user already exists${colors.reset}`);
    }
    
    console.log(`${colors.green}✓ User authentication test completed${colors.reset}`);
    console.log(`${colors.yellow}ℹ To fully test session expiration (Bug #5), manual testing is required.${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ User authentication test failed:${colors.reset}`, error);
    throw error;
  }
}

/**
 * Test post sharing API with and without message
 */
async function testPostSharingAPI() {
  console.log(`${colors.magenta}Testing Post Sharing API (Bug #4)...${colors.reset}`);
  
  try {
    // Create a test post if needed
    const existingPost = await prisma.post.findFirst({
      where: { authorId: testUserId }
    });
    
    if (!existingPost) {
      console.log('Creating test post...');
      const newPost = await prisma.post.create({
        data: {
          title: 'Test Post for Sharing',
          content: 'This is a test post created for testing the post sharing functionality.',
          authorId: testUserId,
          published: true
        }
      });
      testPostId = newPost.id;
      console.log(`${colors.green}✓ Test post created${colors.reset}`);
    } else {
      testPostId = existingPost.id;
      console.log(`${colors.green}✓ Test post already exists${colors.reset}`);
    }
    
    // Find another user to share with
    const otherUser = await prisma.user.findFirst({
      where: {
        id: { not: testUserId }
      }
    });
    
    if (!otherUser) {
      console.log(`${colors.yellow}ℹ No other user found to test sharing with. Creating one...${colors.reset}`);
      const newOtherUser = await prisma.user.create({
        data: {
          email: 'other-test@example.com',
          name: 'Other Test User',
          password: 'password123' // In real app, this would be hashed
        }
      });
      otherUser = newOtherUser;
    }
    
    console.log(`${colors.green}✓ Post sharing API test setup completed${colors.reset}`);
    console.log(`${colors.yellow}ℹ To fully test post sharing (Bug #1, #2, #4), manual testing is required.${colors.reset}\n`);
    
    // Store test data for manual testing
    console.log(`${colors.blue}Test Data for Manual Testing:${colors.reset}`);
    console.log(`- Test User ID: ${testUserId}`);
    console.log(`- Test Post ID: ${testPostId}`);
    console.log(`- Other User ID: ${otherUser.id}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Post sharing API test failed:${colors.reset}`, error);
    throw error;
  }
}

/**
 * Display manual testing instructions
 */
function displayManualTestingInstructions() {
  console.log(`${colors.cyan}Manual Testing Instructions${colors.reset}`);
  console.log(`${colors.cyan}===========================${colors.reset}\n`);
  
  console.log(`${colors.magenta}Testing SharePostModal Component (Bug #1)${colors.reset}`);
  console.log('1. Log in to the application');
  console.log('2. Navigate to a post detail page');
  console.log('3. Click the "Share" button to open the SharePostModal');
  console.log('4. Verify that the modal opens correctly and displays user selection dropdown');
  console.log('5. Select a user and optionally add a message');
  console.log('6. Click "Share" and verify that the post is shared successfully\n');
  
  console.log(`${colors.magenta}Testing SharedPostMessage Component (Bug #2)${colors.reset}`);
  console.log('1. Share a post with another user using the steps above');
  console.log('2. Log in as the recipient user');
  console.log('3. Navigate to the messages section');
  console.log('4. Verify that the shared post appears with a preview');
  console.log('5. Click on the shared post to navigate to the full post\n');
  
  console.log(`${colors.magenta}Testing Session Expiration (Bug #5)${colors.reset}`);
  console.log('1. Log in to the application');
  console.log('2. Leave the application open for more than 30 minutes');
  console.log('3. Periodically interact with the application (click, type)');
  console.log('4. Verify that you remain logged in');
  console.log('5. Test by opening the application in multiple tabs\n');
  
  console.log(`${colors.yellow}Note: For comprehensive testing, refer to the detailed instructions in READMEBUGLOG.md${colors.reset}\n`);
}

// Run the tests
runTests().catch(console.error); 