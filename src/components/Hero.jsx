import { useState, useEffect } from 'react';

function Hero() {
  const [offset, setOffset] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Parallax effect on scroll with debounce
  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      if (rafId) return; // Only update when frame is available
      
      rafId = window.requestAnimationFrame(() => {
        setOffset(window.pageYOffset);
        rafId = null;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);
  
  // Image carousel for background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % 3);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  // Background images with captions
  const backgrounds = [
    {
      image: 'https://images.unsplash.com/photo-1517637382994-f02da38c6728?q=80&w=1976&auto=format&fit=crop',
      category: 'Sport',
      title: 'Dépassez vos limites',
      description: 'Une large sélection d\'activités sportives pour tous les niveaux'
    },
    {
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1471&auto=format&fit=crop',
      category: 'Art',
      title: 'Exprimez votre créativité',
      description: 'Des ateliers artistiques pour tous les âges et tous les talents'
    },
    {
      image: 'https://images.unsplash.com/photo-1607914660217-754b9eba5d18?q=80&w=1470&auto=format&fit=crop',
      category: 'Bien-être',
      title: 'Prenez soin de vous',
      description: 'Des activités de bien-être pour votre équilibre physique et mental'
    }
  ];
  
  const currentBackground = backgrounds[currentImageIndex];

  return (
    <div id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full">
        {backgrounds.map((bg, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${bg.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `scale(${1 + offset * 0.0005})`,
              transition: 'transform 0.3s ease-out'
            }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/70 to-indigo-900/90"></div>
      </div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"
          style={{ transform: `translate(${offset * 0.1}px, ${-offset * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600 rounded-full filter blur-3xl opacity-20"
          style={{ transform: `translate(${-offset * 0.12}px, ${offset * 0.04}px)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-20"
          style={{ transform: `translate(${offset * 0.07}px, ${offset * 0.09}px)` }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center py-16">
        <div className="max-w-4xl mx-auto">
          {/* Category indicator removed as requested */}
          
          {/* Main heading */}
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000"
            style={{ 
              transitionDelay: '300ms',
              animation: 'fadeInUp 0.7s ease-out'
            }}
          >
            <span className="block mb-2">{currentBackground.title}</span>
            <span className="text-blue-300">avec le CSA</span>
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto transition-all duration-1000"
            style={{ 
              transitionDelay: '400ms',
              animation: 'fadeInUp 0.8s ease-out'
            }}
          >
            {currentBackground.description}
          </p>
          
          {/* CTA buttons */}
          <div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8 transition-all duration-1000"
            style={{ 
              transitionDelay: '500ms',
              animation: 'fadeInUp 0.9s ease-out'
            }}
          >
            <button 
              onClick={() => scrollToSection('sections')}
              className="px-8 py-4 bg-white text-blue-800 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              Découvrir nos sections
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Voir nos événements
            </button>
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll down indicator - Now absolute (not fixed) to disappear on scroll */}
      <div 
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10"
        style={{ animation: 'bounce 2s infinite' }}
        onClick={() => scrollToSection('sections')}
      >
        <span className="text-white text-sm font-medium mb-2 opacity-80">Découvrir</span>
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}

// Add animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    40% {
      transform: translateY(-20px) translateX(-50%);
    }
    60% {
      transform: translateY(-10px) translateX(-50%);
    }
  }
`;
document.head.appendChild(style);

export default Hero;