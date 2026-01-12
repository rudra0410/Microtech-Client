import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define route-to-title mapping
const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users Management',
  '/users/:id': 'User Details',
  '/subscriptions': 'Subscriptions Management',
  '/devices': 'Devices Management',
  '/logs': 'System Logs',
  '/notifications': 'Notifications',
  '/admins': 'Admin Management',
  '/settings': 'Settings',
  '/login': 'Admin Login',
};

// Base title for the application
const BASE_TITLE = 'Admin Panel';

// Function to get title based on pathname
const getTitleFromPath = (pathname: string): string => {
  // Check for exact matches first
  if (routeTitles[pathname]) {
    return `${routeTitles[pathname]} - ${BASE_TITLE}`;
  }

  // Check for dynamic routes (like /users/:id)
  for (const [route, title] of Object.entries(routeTitles)) {
    if (route.includes(':')) {
      // Convert route pattern to regex
      const routeRegex = new RegExp(
        '^' + route.replace(/:[^/]+/g, '[^/]+') + '$'
      );
      if (routeRegex.test(pathname)) {
        return `${title} - ${BASE_TITLE}`;
      }
    }
  }

  // Default title
  return BASE_TITLE;
};

export const usePageTitle = (customTitle?: string) => {
  const location = useLocation();

  useEffect(() => {
    const title = customTitle || getTitleFromPath(location.pathname);
    document.title = title;
  }, [location.pathname, customTitle]);
};

// Hook to set a custom title for specific pages
export const useCustomPageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

// Hook to set title with automatic base title appending
export const usePageTitleWithBase = (pageTitle: string) => {
  useEffect(() => {
    document.title = `${pageTitle} - ${BASE_TITLE}`;
  }, [pageTitle]);
};