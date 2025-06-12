import React, { useEffect, useState } from 'react';

function SectionDetailModal({ section, isOpen, onClose, onRegister }) {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen]);
  
  if (!isOpen || !section) return null;
  
  // Generate category-specific colors
  const getCategoryColor = (category) => {
    switch(category) {
      case 'sport':
        return {
          accent: 'bg-emerald-500',
          light: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          hover: 'hover:bg-emerald-600'
        };
      case 'art':
        return {
          accent: 'bg-amber-500',
          light: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          hover: 'hover:bg-amber-600'
        };
      case 'bien-être':
        return {
          accent: 'bg-violet-500',
          light: 'bg-violet-50',
          border: 'border-violet-200',
          text: 'text-violet-700',
          hover: 'hover:bg-violet-600'
        };
      default:
        return {
          accent: 'bg-blue-600',
          light: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          hover: 'hover:bg-blue-700'
        };
    };
  };

  const colors = getCategoryColor(section.category);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto transition-all duration-300 ${isClosing ? 'bg-opacity-0' : 'bg-opacity-60'}`}
      onClick={handleClose}
    >
      <div 
        className={`relative bg-white rounded-xl max-w-4xl w-full shadow-2xl transition-all duration-300 transform ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} max-h-[90vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-3 transition-all duration-200 shadow-lg"
          aria-label="Fermer"
          style={{minHeight: '44px', minWidth: '44px'}}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image header */}
        <div className="relative h-64 md:h-72 lg:h-80">
          <img 
            src={section.image}
            alt={section.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
          
          {/* Category badge */}
          <div className="absolute top-6 left-6">
            <span className={`px-3 py-1.5 ${colors.accent} text-white rounded-lg text-xs font-semibold uppercase tracking-wide`}>
              {section.category}
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{section.name}</h2>
            <p className="text-white/90 mt-2 max-w-2xl">
              {section.shortDescription || section.description.substring(0, 100) + '...'}
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6 -mb-px overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-3 mr-6 border-b-2 font-medium text-sm transition-colors ${activeTab === 'description' ? `border-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-500 text-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-600` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              style={{minHeight: '44px'}}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-3 mr-6 border-b-2 font-medium text-sm transition-colors ${activeTab === 'schedule' ? `border-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-500 text-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-600` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              style={{minHeight: '44px'}}
            >
              Horaires & Tarifs
            </button>
            {section.instructors && (
              <button
                onClick={() => setActiveTab('instructors')}
                className={`py-4 px-3 mr-6 border-b-2 font-medium text-sm transition-colors ${activeTab === 'instructors' ? `border-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-500 text-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-600` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                style={{minHeight: '44px'}}
              >
                Encadrement
              </button>
            )}
            {section.equipment && (
              <button
                onClick={() => setActiveTab('equipment')}
                className={`py-4 px-3 mr-6 border-b-2 font-medium text-sm transition-colors ${activeTab === 'equipment' ? `border-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-500 text-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-600` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                style={{minHeight: '44px'}}
              >
                Équipement
              </button>
            )}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6 overflow-y-auto">
          {/* Description tab */}
          {activeTab === 'description' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-4 rounded-lg ${colors.light} ${colors.border} border`}>
                <p className="text-gray-800 leading-relaxed">
                  {section.fullDescription || section.description}
                </p>
              </div>
              
              {/* Features/tags */}
              {section.features && section.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {section.features.map((feature, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1.5 ${colors.light} ${colors.text} rounded-full text-sm font-medium`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schedule & Pricing tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Schedule */}
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Horaires</h3>
                  </div>
                  <p className="text-gray-700 font-medium">{section.schedule}</p>
                  {section.additionalSchedule && (
                    <ul className="mt-3 space-y-2 text-gray-700">
                      {section.additionalSchedule.map((item, index) => (
                        <li key={index} className="flex items-start bg-gray-50 p-2 rounded-md">
                          <span className="mr-2 text-gray-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Pricing */}
                {section.pricing && (
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold">Tarifs</h3>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      {typeof section.pricing === 'string' ? (
                        <li className="bg-gray-50 p-3 rounded-md">{section.pricing}</li>
                      ) : (
                        section.pricing.map((price, index) => (
                          <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                            <span className="mr-2 text-gray-400">•</span>
                            <span>{price}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructors tab */}
          {activeTab === 'instructors' && section.instructors && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.instructors.map((instructor, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                    {instructor.image ? (
                      <img 
                        src={instructor.image} 
                        alt={instructor.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-full ${colors.light} flex items-center justify-center mr-4`}>
                        <span className={`text-2xl font-semibold ${colors.text}`}>
                          {instructor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold">{instructor.name}</h4>
                      {instructor.title && (
                        <p className="text-gray-600">{instructor.title}</p>
                      )}
                      {instructor.experience && (
                        <p className="text-gray-500 text-sm mt-1">{instructor.experience}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment tab */}
          {activeTab === 'equipment' && section.equipment && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <ul className="space-y-3 text-gray-700">
                  {section.equipment.map((item, index) => (
                    <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="mr-3 mt-0.5 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 py-4 px-6 flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-auto">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 min-h-[48px]"
          >
            Fermer
          </button>
          <button
            onClick={(e) => {e.preventDefault(); onRegister && onRegister(e); handleClose();}}
            className={`w-full sm:w-auto px-5 py-3 ${colors.accent} rounded-lg text-white font-medium ${colors.hover} transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${section.category === 'sport' ? 'emerald' : section.category === 'art' ? 'amber' : section.category === 'bien-être' ? 'violet' : 'blue'}-500 min-h-[48px]`}
          >
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              S'inscrire à cette section
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Add fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default SectionDetailModal;