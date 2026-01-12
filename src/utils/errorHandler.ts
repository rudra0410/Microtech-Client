import { toast } from 'sonner';

// Firebase Auth Error Codes and their user-friendly messages
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/phone-number-already-exists': 'An account with this phone number already exists.',
  'auth/invalid-phone-number': 'Please enter a valid phone number with country code (e.g., +1234567890).',
  'auth/invalid-password': 'Password must be at least 6 characters long.',
  'auth/missing-email': 'Email address is required.',
  'auth/missing-password': 'Password is required.',
  'auth/invalid-display-name': 'Display name contains invalid characters.',
  'auth/invalid-photo-url': 'Profile photo URL is invalid.',
  'auth/uid-already-exists': 'User with this ID already exists.',
  'auth/invalid-uid': 'User ID must be a non-empty string with at most 128 characters.',
  'auth/invalid-claims': 'Custom user claims are invalid.',
  'auth/claims-too-large': 'Custom user claims exceed the maximum allowed size.',
  'auth/id-token-expired': 'Your session has expired. Please sign in again.',
  'auth/id-token-revoked': 'Your session has been revoked. Please sign in again.',
  'auth/insufficient-permission': 'You don\'t have permission to perform this action.',
  'auth/internal-error': 'An internal error occurred. Please try again.',
  'auth/invalid-argument': 'Invalid request. Please check your input and try again.',
  'auth/invalid-creation-time': 'Creation time must be a valid UTC date string.',
  'auth/invalid-disabled-field': 'Disabled field must be a boolean value.',
  'auth/invalid-email-verified': 'Email verified field must be a boolean value.',
  'auth/invalid-hash-algorithm': 'Hash algorithm is not supported.',
  'auth/invalid-hash-block-size': 'Hash block size is invalid.',
  'auth/invalid-hash-derived-key-length': 'Hash derived key length is invalid.',
  'auth/invalid-hash-key': 'Hash key must be a valid byte buffer.',
  'auth/invalid-hash-memory-cost': 'Hash memory cost is invalid.',
  'auth/invalid-hash-parallelization': 'Hash parallelization is invalid.',
  'auth/invalid-hash-rounds': 'Hash rounds is invalid.',
  'auth/invalid-hash-salt-separator': 'Hash salt separator is invalid.',
  'auth/invalid-id-token': 'ID token is invalid.',
  'auth/invalid-last-sign-in-time': 'Last sign-in time must be a valid UTC date string.',
  'auth/invalid-page-token': 'Page token is invalid.',
  'auth/invalid-provider-data': 'Provider data is invalid.',
  'auth/invalid-provider-id': 'Provider ID is invalid.',
  'auth/invalid-oauth-responsetype': 'OAuth response type is invalid.',
  'auth/invalid-session-cookie-duration': 'Session cookie duration is invalid.',
  'auth/invalid-tenant-id': 'Tenant ID is invalid.',
  'auth/invalid-tenant-type': 'Tenant type is invalid.',
  'auth/missing-android-pkg-name': 'Android package name is required.',
  'auth/missing-continue-uri': 'Continue URL is required.',
  'auth/missing-hash-algorithm': 'Hash algorithm is required.',
  'auth/missing-ios-bundle-id': 'iOS bundle ID is required.',
  'auth/missing-uid': 'User ID is required.',
  'auth/missing-oauth-client-secret': 'OAuth client secret is required.',
  'auth/operation-not-supported-in-this-environment': 'This operation is not supported in this environment.',
  'auth/project-not-found': 'Project not found.',
  'auth/reserved-claims': 'Custom claims contain reserved keywords.',
  'auth/session-cookie-expired': 'Your session has expired. Please sign in again.',
  'auth/session-cookie-revoked': 'Your session has been revoked. Please sign in again.',
  'auth/tenant-id-mismatch': 'Tenant ID mismatch.',
  'auth/tenant-not-found': 'Tenant not found.',
  'auth/unauthorized-continue-uri': 'Continue URL is not authorized.',

  // Custom application errors
  'validation/invalid-phone-format': 'Phone number must include country code (e.g., +1234567890).',
  'validation/missing-required-field': 'Please fill in all required fields.',
  'validation/invalid-email-format': 'Please enter a valid email address.',
  'validation/password-too-short': 'Password must be at least 6 characters long.',
  'validation/username-too-short': 'Username must be at least 3 characters long.',
  'validation/username-invalid-chars': 'Username can only contain letters, numbers, and underscores.',

  // Network and server errors
  'network/request-failed': 'Network request failed. Please check your connection.',
  'server/internal-error': 'Server error occurred. Please try again later.',
  'server/service-unavailable': 'Service is temporarily unavailable. Please try again later.',
  'server/timeout': 'Request timed out. Please try again.',

  // Database errors
  'database/permission-denied': 'You don\'t have permission to access this data.',
  'database/unavailable': 'Database is temporarily unavailable. Please try again.',
  'database/data-loss': 'Data operation failed. Please try again.',

  // Generic fallback
  'unknown': 'An unexpected error occurred. Please try again.',
};

// Error types for better categorization
export type ErrorType = 'error' | 'warning' | 'info' | 'success';

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Enhanced error interface
export interface AppError {
  code: string;
  message: string;
  originalError?: unknown;
  severity?: ErrorSeverity;
  type?: ErrorType;
  context?: Record<string, unknown>;
}

/**
 * Parse Firebase error and extract error code and message
 */
export function parseFirebaseError(error: unknown): { code: string; message: string } {
  // Handle different error formats
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    
    if (errorObj.errorInfo && typeof errorObj.errorInfo === 'object') {
      const errorInfo = errorObj.errorInfo as Record<string, unknown>;
      if (errorInfo.code) {
        return {
          code: String(errorInfo.code),
          message: String(errorInfo.message || 'Unknown error occurred')
        };
      }
    }
    
    if (errorObj.code) {
      return {
        code: String(errorObj.code),
        message: String(errorObj.message || 'Unknown error occurred')
      };
    }

    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (data.error && typeof data.error === 'object') {
          const errorData = data.error as Record<string, unknown>;
          if (errorData.code) {
            return {
              code: String(errorData.code),
              message: String(errorData.message || 'Unknown error occurred')
            };
          }
        }
      }
    }

    // Handle Axios errors
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (data.message) {
          return {
            code: String(response.status || 'unknown'),
            message: String(data.message)
          };
        }
      }
    }

    // Handle network errors
    if (errorObj.message && String(errorObj.message).includes('Network Error')) {
      return {
        code: 'network/request-failed',
        message: 'Network connection failed'
      };
    }

    // Fallback for objects with message
    if (errorObj.message) {
      return {
        code: 'unknown',
        message: String(errorObj.message)
      };
    }
  }

  // Fallback for strings or other types
  return {
    code: 'unknown',
    message: typeof error === 'string' ? error : 'An unexpected error occurred'
  };
}

/**
 * Get user-friendly error message from error code
 */
export function getErrorMessage(errorCode: string): string {
  return FIREBASE_ERROR_MESSAGES[errorCode] || FIREBASE_ERROR_MESSAGES['unknown'];
}

/**
 * Determine error severity based on error code
 */
export function getErrorSeverity(errorCode: string): ErrorSeverity {
  const criticalErrors = [
    'auth/internal-error',
    'server/internal-error',
    'database/data-loss'
  ];
  
  const highErrors = [
    'auth/user-disabled',
    'auth/insufficient-permission',
    'database/permission-denied'
  ];
  
  const mediumErrors = [
    'auth/too-many-requests',
    'auth/network-request-failed',
    'network/request-failed',
    'server/service-unavailable'
  ];

  if (criticalErrors.includes(errorCode)) return 'critical';
  if (highErrors.includes(errorCode)) return 'high';
  if (mediumErrors.includes(errorCode)) return 'medium';
  return 'low';
}

/**
 * Show toast notification with appropriate styling based on error severity
 */
export function showErrorToast(error: unknown, customMessage?: string): void {
  const { code, message } = parseFirebaseError(error);
  const userMessage = customMessage || getErrorMessage(code);
  const severity = getErrorSeverity(code);

  // Log the original error for debugging
  console.error('Error occurred:', { code, originalMessage: message, error });

  // Show toast based on severity
  switch (severity) {
    case 'critical':
      toast.error(userMessage, {
        duration: 8000,
        description: 'Please contact support if this issue persists.',
      });
      break;
    case 'high':
      toast.error(userMessage, {
        duration: 6000,
      });
      break;
    case 'medium':
      toast.warning(userMessage, {
        duration: 5000,
      });
      break;
    default:
      toast.error(userMessage, {
        duration: 4000,
      });
  }
}

/**
 * Show success toast notification
 */
export function showSuccessToast(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Show info toast notification
 */
export function showInfoToast(message: string, description?: string): void {
  toast.info(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show warning toast notification
 */
export function showWarningToast(message: string, description?: string): void {
  toast.warning(message, {
    description,
    duration: 5000,
  });
}

/**
 * Handle API errors with consistent error handling
 */
export function handleApiError(error: unknown, context?: string): void {
  const { code } = parseFirebaseError(error);
  
  // Add context to error logging
  console.error(`API Error${context ? ` in ${context}` : ''}:`, {
    code,
    error,
    timestamp: new Date().toISOString(),
  });

  showErrorToast(error);
}

/**
 * Validate form data and show appropriate error messages
 */
export function validateFormData(data: Record<string, unknown>, rules: Record<string, (value: unknown) => string | null>): boolean {
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      toast.error(error);
      return false;
    }
  }
  return true;
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (fieldName: string) => (value: unknown) => 
    !value || (typeof value === 'string' && !value.trim()) ? `${fieldName} is required` : null,
  
  email: (value: unknown) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(String(value)) ? 'Please enter a valid email address' : null;
  },
  
  phone: (value: unknown) => {
    if (!value) return null;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return !phoneRegex.test(String(value)) ? 'Phone number must include country code (e.g., +1234567890)' : null;
  },
  
  password: (value: unknown) => {
    if (!value) return null;
    return String(value).length < 6 ? 'Password must be at least 6 characters long' : null;
  },
  
  username: (value: unknown) => {
    if (!value) return null;
    const strValue = String(value);
    if (strValue.length < 3) return 'Username must be at least 3 characters long';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return !usernameRegex.test(strValue) ? 'Username can only contain letters, numbers, and underscores' : null;
  },
};

export default {
  parseFirebaseError,
  getErrorMessage,
  getErrorSeverity,
  showErrorToast,
  showSuccessToast,
  showInfoToast,
  showWarningToast,
  handleApiError,
  validateFormData,
  validationRules,
};