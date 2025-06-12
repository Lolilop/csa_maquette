import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sections } from '../data/sections';
import Navbar from './Navbar';
import Footer from './Footer';
import routes from '../utils/routes';
import SectionRegistrationForm from './SectionRegistrationForm';

function SectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const galleryRef = useRef(null);
  
  // Get section data from the sections array
  useEffect(() => {
    // Find the section with the matching ID
    const foundSection = sections.find(s => s.id === parseInt(sectionId, 10));
    
    // If no section is found or if it doesn't have detail page content,
    // redirect to home page after a delay
    if (!foundSection || !foundSection.hasDetailPage) {
      const timer = setTimeout(() => {
        navigate('/not-found');
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    setSection(foundSection);
    setLoading(false);
    
    // Set page title
    document.title = `${foundSection.name} - CSA Saint-Priest`;
  }, [sectionId, navigate]);
  
  // Track scroll progress
  useEffect(() => {
    if (loading) return;
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / totalScroll) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Get detail page content with fallbacks
  const detailContent = section?.detailPageContent || {
    heroTitle: section?.name || 'Section',
    heroSubtitle: section?.description || 'Découvrez notre section',
    sections: [
      {
        title: 'Présentation',
        content: `<p>${section?.fullDescription || section?.description || 'Informations à venir.'}</p>`
      }
    ],
    galleryImages: []
  };
  
  return (
    <div className="font-[Montserrat] bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Progress indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      ></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-blue-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${section.image})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-indigo-900/80"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            {detailContent.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            {detailContent.heroSubtitle}
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8 lg:p-10">
              {detailContent.sections.map((contentSection, index) => (
                <div key={index} className={index > 0 ? 'mt-12' : ''}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                    {contentSection.title}
                  </h2>
                  <div className="prose prose-blue max-w-none" 
                    dangerouslySetInnerHTML={{ __html: contentSection.content }} 
                  />
                </div>
              ))}
              
              {/* Registration CTA */}
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-blue-800 mb-1">
                      Inscrivez-vous à cette section
                    </h3>
                    <p className="text-blue-700">
                      Rejoignez-nous et participez aux activités de {section.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowRegistrationForm(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm text-center"
                  >
                    S'inscrire maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gallery Section */}
          {detailContent.galleryImages && detailContent.galleryImages.length > 0 && (
            <div ref={galleryRef} className="mt-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
                  Galerie
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detailContent.galleryImages.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md h-64 bg-gray-100">
                      <img 
                        src={image} 
                        alt={`${section.name} - image ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/assets/images/image-placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Section Info */}
          <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Informations pratiques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Horaires</h3>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {section.schedule}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Public</h3>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {section.participants || 'Tous niveaux'}
                  </p>
                </div>
                
                {section.price && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Tarif</h3>
                    <p className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {section.price}
                    </p>
                  </div>
                )}
                
                {section.location && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Lieu</h3>
                    <p className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {section.location}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Features */}
              {section.features && section.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Caractéristiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {section.features.map((feature, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 z-30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${scrollProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Retour en haut"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Home button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed left-6 bottom-6 p-3 rounded-full bg-white text-blue-600 shadow-lg transition-all duration-300 z-30 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border border-blue-200"
        aria-label="Retour à l'accueil"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      
      {/* Registration Form Modal */}
      <SectionRegistrationForm 
        isOpen={showRegistrationForm} 
        onClose={() => setShowRegistrationForm(false)} 
        section={section} 
      />
    </div>
  );
}

export default SectionPage;