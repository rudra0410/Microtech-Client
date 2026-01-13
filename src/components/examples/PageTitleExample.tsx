import React, { useState } from 'react';
import { usePageTitle, useCustomPageTitle, usePageTitleWithBase } from '../../hooks/usePageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

/**
 * Example component demonstrating the page title system
 */
export const PageTitleExample: React.FC = () => {
  const [customTitle, setCustomTitle] = useState('');
  const [titleMode, setTitleMode] = useState<'auto' | 'custom' | 'base'>('auto');

  // Call all hooks unconditionally
  usePageTitle();
  useCustomPageTitle(titleMode === 'custom' && customTitle ? customTitle : '');
  usePageTitleWithBase(titleMode === 'base' && customTitle ? customTitle : '');

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Title System Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-input">Custom Title</Label>
            <Input
              id="title-input"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter a custom title"
            />
          </div>

          <div className="space-y-2">
            <Label>Title Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={titleMode === 'auto' ? 'default' : 'outline'}
                onClick={() => setTitleMode('auto')}
                size="sm"
              >
                Auto (Route-based)
              </Button>
              <Button
                variant={titleMode === 'custom' ? 'default' : 'outline'}
                onClick={() => setTitleMode('custom')}
                size="sm"
              >
                Custom Title
              </Button>
              <Button
                variant={titleMode === 'base' ? 'default' : 'outline'}
                onClick={() => setTitleMode('base')}
                size="sm"
              >
                With Base Title
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Current Settings:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Mode:</strong> {titleMode}</li>
              <li><strong>Custom Title:</strong> {customTitle || 'None'}</li>
              <li><strong>Current Page Title:</strong> {document.title}</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">How it works:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Auto:</strong> Uses route-based title (e.g., "Dashboard - Admin Panel")</li>
              <li><strong>Custom:</strong> Uses your exact custom title</li>
              <li><strong>With Base:</strong> Appends "- Admin Panel" to your custom title</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route-Based Titles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Available Routes:</h4>
              <ul className="space-y-1 text-sm">
                <li>/dashboard → "Dashboard - Admin Panel"</li>
                <li>/users → "Users Management - Admin Panel"</li>
                <li>/users/123 → "User Details - Admin Panel"</li>
                <li>/subscriptions → "Subscriptions Management - Admin Panel"</li>
                <li>/devices → "Devices Management - Admin Panel"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">More Routes:</h4>
              <ul className="space-y-1 text-sm">
                <li>/logs → "System Logs - Admin Panel"</li>
                <li>/notifications → "Notifications - Admin Panel"</li>
                <li>/admins → "Admin Management - Admin Panel"</li>
                <li>/settings → "Settings - Admin Panel"</li>
                <li>/login → "Admin Login - Admin Panel"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};