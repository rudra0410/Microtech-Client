import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Button } from './ui/button';

export const ConnectionTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const testConnection = async () => {
    setStatus('loading');
    try {
      const response = await apiService.healthCheck();
      // Handle both string and object responses
      if (typeof response === 'string') {
        setMessage(response);
      } else if (response && typeof response === 'object') {
        // If it's an object, extract the message or stringify it safely
        const responseObj = response as any;
        setMessage(responseObj.message || JSON.stringify(response));
      } else {
        setMessage('Connection successful');
      }
      setStatus('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Connection failed');
      setStatus('error');
    }
  };

  useEffect(() => {
    // Auto-test connection on mount
    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Server Connection Status</h3>
      <div className="flex items-center gap-2 mb-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            status === 'success' ? 'bg-green-500' : 
            status === 'error' ? 'bg-red-500' : 
            status === 'loading' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}
        />
        <span className="text-sm">
          {status === 'success' ? 'Connected' : 
           status === 'error' ? 'Disconnected' : 
           status === 'loading' ? 'Connecting...' : 'Unknown'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{message}</p>
      <Button 
        onClick={testConnection} 
        disabled={status === 'loading'}
        size="sm"
      >
        {status === 'loading' ? 'Testing...' : 'Test Connection'}
      </Button>
    </div>
  );
};