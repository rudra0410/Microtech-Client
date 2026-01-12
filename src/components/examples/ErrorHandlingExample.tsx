import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { showErrorToast, showSuccessToast, validateFormData, validationRules } from '../../utils/errorHandler';
import { userService } from '../../services/userService';

/**
 * Example component demonstrating Firebase error handling with user-friendly toast messages
 */
export const ErrorHandlingExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = async () => {
    // Validate form data using the error handler utility
    const isValid = validateFormData(formData, {
      name: validationRules.required('Name'),
      email: validationRules.email,
      mobile: validationRules.phone,
      password: validationRules.password
    });

    if (!isValid) return;

    setIsLoading(true);
    try {
      const newUser = await userService.createUser(formData);
      showSuccessToast('User created successfully!', `${newUser.name} has been added to the system.`);
      
      // Reset form
      setFormData({ name: '', email: '', mobile: '', password: '' });
    } catch (error) {
      // The error handler will automatically show appropriate toast messages
      // based on the Firebase error code
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateFirebaseErrors = () => {
    const errorExamples = [
      {
        errorInfo: { code: 'auth/phone-number-already-exists', message: 'The user with the provided phone number already exists.' },
        codePrefix: 'auth'
      },
      {
        errorInfo: { code: 'auth/email-already-in-use', message: 'The email address is already in use by another account.' },
        codePrefix: 'auth'
      },
      {
        errorInfo: { code: 'auth/invalid-phone-number', message: 'The phone number is not a valid phone number.' },
        codePrefix: 'auth'
      },
      {
        errorInfo: { code: 'auth/weak-password', message: 'The password is too weak.' },
        codePrefix: 'auth'
      }
    ];

    const randomError = errorExamples[Math.floor(Math.random() * errorExamples.length)];
    showErrorToast(randomError);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Error Handling Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value)}
            placeholder="Enter phone number with country code (+1234567890)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password (min 6 characters)"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleCreateUser} 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
          
          <Button 
            onClick={simulateFirebaseErrors} 
            variant="outline"
            className="flex-1"
          >
            Test Error Messages
          </Button>
        </div>

        <div className="text-sm text-slate-600 space-y-1">
          <p><strong>Try these scenarios:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Leave fields empty to see validation errors</li>
            <li>Enter invalid email format</li>
            <li>Enter phone without country code</li>
            <li>Use password less than 6 characters</li>
            <li>Click "Test Error Messages" to see Firebase error examples</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorHandlingExample;