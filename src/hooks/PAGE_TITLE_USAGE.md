# Page Title Management System

This document explains how the page title system works in the admin panel application.

## Overview

The page title system automatically updates the browser tab title based on the current route and provides hooks for custom title management.

## Automatic Route-Based Titles

The system automatically sets page titles based on the current route:

| Route | Title |
|-------|-------|
| `/dashboard` | Dashboard - Admin Panel |
| `/users` | Users Management - Admin Panel |
| `/users/:id` | User Details - Admin Panel |
| `/subscriptions` | Subscriptions Management - Admin Panel |
| `/devices` | Devices Management - Admin Panel |
| `/logs` | System Logs - Admin Panel |
| `/notifications` | Notifications - Admin Panel |
| `/admins` | Admin Management - Admin Panel |
| `/settings` | Settings - Admin Panel |
| `/login` | Admin Login - Admin Panel |

## Available Hooks

### 1. `usePageTitle(customTitle?: string)`

Automatically sets the page title based on the current route. Can be overridden with a custom title.

```typescript
import { usePageTitle } from '../hooks/usePageTitle';

const MyComponent = () => {
  // Automatic title based on route
  usePageTitle();
  
  // Or with custom title
  usePageTitle('Custom Page Title');
  
  return <div>Content</div>;
};
```

### 2. `useCustomPageTitle(title: string)`

Sets a custom page title and restores the previous title when the component unmounts.

```typescript
import { useCustomPageTitle } from '../hooks/usePageTitle';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  
  // Dynamic title based on user data
  useCustomPageTitle(
    user ? `${user.name} - User Details - Admin Panel` : 'User Details - Admin Panel'
  );
  
  return <div>User details content</div>;
};
```

### 3. `usePageTitleWithBase(pageTitle: string)`

Sets a page title and automatically appends the base title "Admin Panel".

```typescript
import { usePageTitleWithBase } from '../hooks/usePageTitle';

const MyComponent = () => {
  // Results in "My Custom Page - Admin Panel"
  usePageTitleWithBase('My Custom Page');
  
  return <div>Content</div>;
};
```

## Implementation Details

### App-Level Integration

The page title system is integrated at the app level through a `PageTitleManager` component:

```typescript
// In App.tsx
const PageTitleManager = () => {
  usePageTitle();
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <PageTitleManager />
      <Routes>
        {/* Routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Route Pattern Matching

The system supports dynamic routes using pattern matching:

- Static routes: `/dashboard` → exact match
- Dynamic routes: `/users/:id` → regex pattern matching

### Title Structure

All titles follow the pattern: `[Page Name] - Admin Panel`

- Base title: "Admin Panel"
- Page titles are descriptive and user-friendly
- Dynamic content (like user names) can be included

## Usage Examples

### Basic Page (Automatic)

Most pages don't need any special setup - titles are handled automatically:

```typescript
// pages/Dashboard.tsx
const Dashboard = () => {
  // Title automatically becomes "Dashboard - Admin Panel"
  return <div>Dashboard content</div>;
};
```

### Dynamic Page Title

For pages with dynamic content:

```typescript
// pages/UserDetail.tsx
const UserDetail = () => {
  const [user, setUser] = useState(null);
  
  // Dynamic title updates when user data loads
  useCustomPageTitle(
    user ? `${user.name} - User Details - Admin Panel` : 'Loading User - Admin Panel'
  );
  
  return <div>User details</div>;
};
```

### Modal or Dialog Titles

For temporary title changes:

```typescript
const EditUserModal = ({ isOpen, user }) => {
  // Only set title when modal is open
  useCustomPageTitle(
    isOpen && user ? `Editing ${user.name} - Admin Panel` : undefined
  );
  
  return <Modal>{/* Modal content */}</Modal>;
};
```

## Best Practices

1. **Use Automatic Titles**: Let the route-based system handle most pages
2. **Dynamic Content**: Use `useCustomPageTitle` for pages with dynamic data
3. **Descriptive Names**: Make titles descriptive and user-friendly
4. **Consistent Format**: Always include "Admin Panel" as the base
5. **Loading States**: Provide meaningful titles during loading states
6. **Cleanup**: The hooks automatically handle cleanup when components unmount

## Customization

To modify the route-to-title mapping, edit the `routeTitles` object in `usePageTitle.ts`:

```typescript
const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users Management',
  // Add new routes here
  '/reports': 'Reports & Analytics',
};
```

To change the base title, modify the `BASE_TITLE` constant:

```typescript
const BASE_TITLE = 'Your App Name';
```