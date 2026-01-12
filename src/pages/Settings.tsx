import {
  Shield,
  Clock,
  Database,
  Bell,
  Globe,
  Lock,
  Server,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import StatusBadge from '../components/common/StatusBadge';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" /> System Configuration
          </CardTitle>
          <CardDescription>View system settings and configuration (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Database</span>
              </div>
              <p className="text-sm text-slate-900">MongoDB v7.0</p>
              <p className="text-xs text-slate-500">Primary cluster</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">API Version</span>
              </div>
              <p className="text-sm text-slate-900">v2.4.1</p>
              <p className="text-xs text-slate-500">Latest stable</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Server Time</span>
              </div>
              <p className="text-sm text-slate-900">UTC+0</p>
              <p className="text-xs text-slate-500">Coordinated Universal Time</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Environment</span>
              </div>
              <p className="text-sm text-slate-900">Production</p>
              <StatusBadge status="active" className="mt-1">Live</StatusBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" /> Security Settings
          </CardTitle>
          <CardDescription>Security flags and authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Require 2FA for all admin accounts</p>
              </div>
            </div>
            <StatusBadge status="active">Enabled</StatusBadge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Session Timeout</p>
                <p className="text-sm text-slate-500">Auto-logout after inactivity</p>
              </div>
            </div>
            <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded">30 minutes</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Password Policy</p>
                <p className="text-sm text-slate-500">Minimum 12 characters, mixed case, numbers</p>
              </div>
            </div>
            <StatusBadge status="active">Strong</StatusBadge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Failed Login Lockout</p>
                <p className="text-sm text-slate-500">Lock account after 5 failed attempts</p>
              </div>
            </div>
            <StatusBadge status="active">Enabled</StatusBadge>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notification Preferences
          </CardTitle>
          <CardDescription>Configure admin notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Security Alerts</p>
              <p className="text-sm text-slate-500">Get notified of failed logins and security events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Subscription Expiry</p>
              <p className="text-sm text-slate-500">Alert when subscriptions are expiring</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Device Offline</p>
              <p className="text-sm text-slate-500">Notify when devices go offline</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Daily Summary</p>
              <p className="text-sm text-slate-500">Receive daily activity summary email</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Audit Trail
          </CardTitle>
          <CardDescription>Access audit logs and activity history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Full Audit Trail Access</p>
                <p className="text-sm text-slate-600 mt-1">
                  Complete audit logs are available in the Logs & Analytics section. 
                  All admin actions, user activities, and system events are recorded.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                  Go to Logs <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-500">
            <Server className="w-5 h-5" /> Advanced Settings
            <StatusBadge status="scheduled" className="ml-2">Coming Soon</StatusBadge>
          </CardTitle>
          <CardDescription>
            Additional configuration options will be available in future updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-600">API Rate Limiting</p>
              <p className="text-sm text-slate-400">Configure API request limits</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-600">Backup Configuration</p>
              <p className="text-sm text-slate-400">Set up automated backups</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-600">Custom Branding</p>
              <p className="text-sm text-slate-400">Customize panel appearance</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-medium text-slate-600">Integration Settings</p>
              <p className="text-sm text-slate-400">Third-party integrations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
