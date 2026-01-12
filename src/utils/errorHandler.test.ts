// Simple test examples for the error handler
// This file demonstrates how the error handler works with different error formats

import { parseFirebaseError, getErrorMessage, getErrorSeverity } from './errorHandler';

// Test Firebase error parsing
console.log('=== Firebase Error Parsing Tests ===');

// Test 1: Firebase auth error format
const firebaseError1 = {
  errorInfo: {
    code: 'auth/phone-number-already-exists',
    message: 'The user with the provided phone number already exists.'
  },
  codePrefix: 'auth'
};

const parsed1 = parseFirebaseError(firebaseError1);
console.log('Test 1 - Firebase Auth Error:');
console.log('Input:', firebaseError1);
console.log('Parsed:', parsed1);
console.log('User Message:', getErrorMessage(parsed1.code));
console.log('Severity:', getErrorSeverity(parsed1.code));
console.log('---');

// Test 2: Axios error format
const axiosError = {
  response: {
    status: 400,
    data: {
      error: {
        code: 'auth/email-already-in-use',
        message: 'The email address is already in use by another account.',
        codePrefix: 'auth'
      }
    }
  }
};

const parsed2 = parseFirebaseError(axiosError);
console.log('Test 2 - Axios Error:');
console.log('Input:', axiosError);
console.log('Parsed:', parsed2);
console.log('User Message:', getErrorMessage(parsed2.code));
console.log('Severity:', getErrorSeverity(parsed2.code));
console.log('---');

// Test 3: Network error
const networkError = {
  message: 'Network Error: Request failed'
};

const parsed3 = parseFirebaseError(networkError);
console.log('Test 3 - Network Error:');
console.log('Input:', networkError);
console.log('Parsed:', parsed3);
console.log('User Message:', getErrorMessage(parsed3.code));
console.log('Severity:', getErrorSeverity(parsed3.code));
console.log('---');

// Test 4: Unknown error
const unknownError = {
  message: 'Something went wrong'
};

const parsed4 = parseFirebaseError(unknownError);
console.log('Test 4 - Unknown Error:');
console.log('Input:', unknownError);
console.log('Parsed:', parsed4);
console.log('User Message:', getErrorMessage(parsed4.code));
console.log('Severity:', getErrorSeverity(parsed4.code));
console.log('---');

// Test error severity classification
console.log('=== Error Severity Classification ===');
const testCodes = [
  'auth/phone-number-already-exists',
  'auth/internal-error',
  'auth/user-disabled',
  'auth/too-many-requests',
  'auth/invalid-email',
  'network/request-failed',
  'database/permission-denied'
];

testCodes.forEach(code => {
  console.log(`${code}: ${getErrorSeverity(code)} severity - "${getErrorMessage(code)}"`);
});

export {}; // Make this a module