import { useState } from 'react';
import SectionCard from './SectionCard';
import { sections } from '../data/sections';
import MultiSectionRegistrationForm from './MultiSectionRegistrationForm';

function SectionsGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMultiFormOpen, setIsMultiFormOpen] = useState(false);
  const [useMultiSection, setUseMultiSection] = useState(true);
  
  // Extract unique categories from sections
  const categories = ['all', ...new Set(sections.map(section => section.category))];
  
  // Filter sections by active category
  const filteredSections = activeCategory === 'all' 
    ? sections 
    : sections.filter(section => section.category === activeCategory);

  return (
    <div>
      {/* Registration Options */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setUseMultiSection(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!useMultiSection ? 'bg-white text-blue-700 shadow' : 'text-gray-700'}`}
          >
            Inscription individuelle
          </button>
          <button
            onClick={() => setUseMultiSection(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${useMultiSection ? 'bg-white text-blue-700 shadow' : 'text-gray-700'}`}
          >
            Inscription multi-sections
          </button>
        </div>
      </div>

      {/* Multi-section direct registration button */}
      {useMultiSection && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setIsMultiFormOpen(true)}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Démarrer l'inscription multi-sections
          </button>
        </div>
      )}
      
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSections.map(section => (
          <SectionCard 
            key={section.id} 
            section={section} 
            useMultiSectionForm={useMultiSection}
          />
        ))}
      </div>

      {/* Multi-section registration form modal */}
      <MultiSectionRegistrationForm
        isOpen={isMultiFormOpen}
        onClose={() => setIsMultiFormOpen(false)}
      />
    </div>
  );
}

export default SectionsGrid;