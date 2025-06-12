import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { Link } from 'react-router-dom';

function AuthButton({ isScrolled, isMobile }) {
  const { user, isAuthenticated, isAdmin, logout } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animation for dropdown menu
  useEffect(() => {
    if (showDropdown) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsMenuVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showDropdown]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Define button styles based on the scroll state
  const buttonStyles = isScrolled || isMobile
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30";

  return (
    <>
      {isAuthenticated ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className={`flex items-center space-x-2 rounded-full pr-3 transition-all duration-300 ${isScrolled || isMobile ? 'hover:bg-blue-700' : 'hover:bg-white/20'} ${isMobile ? 'w-full justify-between' : ''}`}
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            <div 
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${isScrolled || isMobile ? 'bg-blue-700 text-white' : 'bg-white/20 text-white'}`}
            >
              <span className="font-medium text-sm">
                {user?.name?.substring(0, 1).toUpperCase() || 'U'}
              </span>
            </div>
            <span className={`hidden md:inline font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              {user?.name || 'Utilisateur'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'transform rotate-180' : ''} ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* User dropdown menu */}
          {isMenuVisible && (
            <div 
              className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-20 transform origin-top-right transition-all duration-200 overflow-hidden ${showDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'utilisateur@example.com'}</p>
              </div>
              
              {/* Menu items */}
              <div className="py-1">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <svg className="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <svg className="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Mes réservations
                </a>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center px-4 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <svg className="mr-2 w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Administration
                  </Link>
                )}
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <svg className="mr-2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </a>
              </div>
              
              <div className="py-1 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="mr-2 w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`flex items-center ${isMobile ? 'w-full' : 'gap-2'}`}>
          <button
            onClick={handleLoginClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${buttonStyles} hover:shadow-md ${isMobile ? 'w-full flex justify-center' : ''}`}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Se connecter
            </span>
          </button>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}

export default AuthButton;