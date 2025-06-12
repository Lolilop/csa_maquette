import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthButton from './auth/AuthButton';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the home page or a section page
  const isHomePage = location.pathname === '/';

  // Track scroll position, detect active section, and hide/show navbar
  useEffect(() => {
    let rafId;
    let ticking = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          // Update navbar style based on scroll position
          setIsScrolled(currentScrollY > 50);
          
          // Always keep navbar visible when scrolling
          setNavVisible(true);
          
          setLastScrollY(currentScrollY);
          
          // Detect which section is in view (less frequently)
          if (currentScrollY % 5 === 0) { // Only check every 5px of scrolling
            const sections = ['home', 'sections', 'about', 'events', 'contact'];
            const scrollPosition = currentScrollY + 200;

            for (const sectionId of sections) {
              const element = document.getElementById(sectionId);
              if (element && element.offsetTop <= scrollPosition && 
                  element.offsetTop + element.offsetHeight > scrollPosition) {
                setActiveSection(sectionId);
                break;
              }
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Smooth scroll to section or navigate to home
  const scrollToSection = (sectionId) => {
    // If we're on the home page, just scroll to the section
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = navRef.current?.offsetHeight || 80;
        window.scrollTo({
          top: element.offsetTop - navHeight,
          behavior: 'smooth'
        });
        setActiveSection(sectionId);
      }
    } else {
      // If we're on a section page, navigate back to home and then scroll
      navigate('/');
      // Add a small delay to ensure the navigation is complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navHeight = navRef.current?.offsetHeight || 80;
          window.scrollTo({
            top: element.offsetTop - navHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
    
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'sections', label: 'Sections', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'about', label: 'À propos', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'events', label: 'Événements', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <nav 
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'} ${navVisible ? 'translate-y-0' : '-translate-y-full shadow-none'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href={isHomePage ? "#" : "/"} 
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  scrollToSection('home');
                }
              }} 
              className="flex items-center group"
              aria-label="Accueil"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 mr-2 ${isScrolled ? 'bg-blue-600' : 'bg-white/20'}`}>
                <span 
                  className={`text-xl font-bold transition-all duration-300 ${isScrolled ? 'text-white' : 'text-white'} group-hover:scale-110`}
                >
                  CSA
                </span>
              </div>
              <span 
                className={`transition-all duration-300 font-medium hidden sm:inline ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                Centre Sportif et Artistique
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-6 mr-4">
              {navItems.map((item) => (
                <a 
                  key={item.id}
                  href={isHomePage ? `#${item.id}` : '/'} 
                  onClick={(e) => {
                    if (isHomePage) {
                      e.preventDefault();
                    }
                    scrollToSection(item.id);
                  }} 
                  className={`relative group flex flex-col items-center py-1 px-2 transition-all duration-300
                    ${activeSection === item.id ? 'font-medium' : ''}
                    ${isScrolled 
                      ? activeSection === item.id 
                        ? 'text-blue-700' 
                        : 'text-gray-700 hover:text-blue-700' 
                      : activeSection === item.id 
                        ? 'text-white' 
                        : 'text-white/90 hover:text-white'}`}
                >
                  <span className="relative">
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full transform origin-left transition-transform duration-300
                        ${activeSection === item.id 
                          ? 'scale-x-100' 
                          : 'scale-x-0 group-hover:scale-x-100'}
                        ${isScrolled ? 'bg-blue-600' : 'bg-white'}`}
                      style={{
                        transformOrigin: 'left',
                        bottom: '-4px'  
                      }}
                    ></span>
                  </span>
                </a>
              ))}
            </div>
            <AuthButton isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none p-2 rounded-full transition-all duration-300 ${isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <div className="w-5 h-5 relative">
                <span 
                  className={`absolute h-0.5 w-full rounded-sm transform transition-all duration-300 ease-in-out ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-full rounded-sm top-2 transform transition-all duration-200 ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-full rounded-sm transform transition-all duration-300 ease-in-out ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[70vh] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
          style={{ transitionProperty: 'max-height, opacity, margin' }}
        >
          <div className={`py-3 space-y-1 overflow-y-auto rounded-xl ${isScrolled ? 'bg-white shadow-md' : 'bg-black/20 backdrop-blur-md'}`}>
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={isHomePage ? `#${item.id}` : '/'} 
                onClick={(e) => {
                  if (isHomePage) {
                    e.preventDefault();
                  }
                  scrollToSection(item.id);
                }} 
                className={`block py-3 px-4 rounded-lg transition-all duration-300 flex items-center
                  ${activeSection === item.id 
                    ? isScrolled ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white/10 text-white font-medium'
                    : isScrolled ? 'text-gray-800 hover:bg-gray-50' : 'text-white hover:bg-white/5'}`}
              >
                <svg 
                  className="w-5 h-5 mr-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <div className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </a>
            ))}
            {/* Auth button added to mobile menu */}
            <div className="px-4 pt-2">
              <AuthButton isScrolled={isScrolled} isMobile={true} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;