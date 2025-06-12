import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionDetailModal from './SectionDetailModal';
import SectionRegistrationForm from './SectionRegistrationForm';
import MultiSectionRegistrationForm from './MultiSectionRegistrationForm';
import routes from '../utils/routes';

function SectionCard({ section, useMultiSectionForm = false, handleMultiSection = null }) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleShowDetails = (e) => {
    e.preventDefault();
    setIsDetailModalOpen(true);
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    // Open registration modal
    setIsRegistrationModalOpen(true);
  };

  // Generate vibrant category colors
  const getCategoryColor = (category) => {
    switch(category) {
      case 'sport':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          accent: 'bg-emerald-500',
          hoverAccent: 'hover:bg-emerald-600'
        };
      case 'art':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          accent: 'bg-amber-500',
          hoverAccent: 'hover:bg-amber-600'
        };
      case 'bien-être':
        return {
          bg: 'bg-violet-100',
          text: 'text-violet-800',
          accent: 'bg-violet-500',
          hoverAccent: 'hover:bg-violet-600'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          accent: 'bg-blue-600',
          hoverAccent: 'hover:bg-blue-700'
        };
    };
  };

  const categoryColors = getCategoryColor(section.category);

  return (
    <>
      <div 
        className="overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl bg-white group relative flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${categoryColors.bg} ${categoryColors.text}`}>
            {section.category}
          </span>
        </div>

        {/* Image section with hover effect */}
        <div className="h-52 relative overflow-hidden">
          <img 
            src={section.image} 
            alt={section.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-60'}`}></div>
          
          {/* Title */}
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-all duration-300">
              {section.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col">
          <p className="text-gray-700 mb-4 flex-grow">{section.description}</p>
          
          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {section.features.map((feature, index) => (
              <span 
                key={index} 
                className={`px-2 py-1 ${categoryColors.bg} ${categoryColors.text} rounded-md text-xs font-medium transition-all duration-300`}
              >
                {feature}
              </span>
            ))}
          </div>
          
          {/* Schedule */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pt-3 border-t border-gray-100 gap-2">
            <div className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-grow">{section.schedule}</span>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="flex-grow">{section.participants || 'Tous niveaux'}</span>
            </div>
          </div>
          
          {/* Main action buttons - Always 2 columns, but stack on small mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            
            <button
              onClick={handleShowDetails}
              className={`flex justify-center items-center px-4 py-3 sm:py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm min-h-[44px]`}
              aria-label={`En savoir plus sur ${section.name}`}
            >
              <span className="flex items-center">
                En savoir plus
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            
            <button
              onClick={handleRegistration}
              className={`flex justify-center items-center px-4 py-3 sm:py-2 ${categoryColors.accent} ${categoryColors.hoverAccent} text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm min-h-[44px]`}
              aria-label={`S'inscrire à la section ${section.name}`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                S'inscrire
              </span>
            </button>
            
            {/* Page button - Full width row below */}
            {section.hasDetailPage && (
              <div className="sm:col-span-2 mt-3">
                <Link
                  to={`/sections/${section.id}`}
                  className={`flex justify-center items-center w-full px-4 py-3 sm:py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm min-h-[44px]`}
                  aria-label={`Voir la page de ${section.name}`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Page
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Detail Modal */}
      <SectionDetailModal 
        section={section} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        onRegister={handleRegistration}
      />

      {/* Registration Form - either single section or multi-section */}
      {useMultiSectionForm ? (
        <MultiSectionRegistrationForm
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          initialSection={section}
        />
      ) : (
        <SectionRegistrationForm
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          section={section}
        />
      )}
    </>
  );
}

export default SectionCard;