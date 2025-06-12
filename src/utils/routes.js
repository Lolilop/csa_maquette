/**
 * Application routes configuration
 * This file centralizes all route paths used in the application
 * for better organization and maintainability.
 */

const routes = {
  // Main routes
  home: '/',
  about: '/about',
  contact: '/contact',
  organization: '/organization',
  notFound: '/not-found',
  
  // Section related routes
  sections: '/sections',
  getSectionDetailRoute: (sectionId) => `/sections/${sectionId}`,
  // HashRouter compatible routes
  getHashSectionDetailRoute: (sectionId) => `#/sections/${sectionId}`,
  
  // Auth related routes
  login: '/login',
  register: '/register',
  profile: '/profile',
  
  // Admin related routes
  adminPanel: '/admin',
  adminSections: '/admin/sections',
  adminEvents: '/admin/events',
  adminUsers: '/admin/users',
  
  // Helper function to generate dynamic routes
  generatePath: (route, params) => {
    let path = route;
    if (params) {
      Object.keys(params).forEach(key => {
        path = path.replace(`:${key}`, params[key]);
      });
    }
    return path;
  }
};

export default routes;