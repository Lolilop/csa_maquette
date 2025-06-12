import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

// Custom hook to use the user context
export function useUser() {
  return useContext(UserContext);
}

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem('csa_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('csa_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('csa_user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('csa_user');
  };

  // Update user profile
  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('csa_user', JSON.stringify(updatedUser));
  };

  // Check if the user has admin role
  const isAdmin = user?.role === 'admin' || sessionStorage.getItem('csaAdminLoggedIn') === 'true';

  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;