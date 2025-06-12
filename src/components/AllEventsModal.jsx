import { useState, useEffect, useRef } from 'react';
import { events } from '../data/events';

function AllEventsModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [activeMonth, setActiveMonth] = useState('all');
  const [activeSection, setActiveSection] = useState('all');
  const [activeYear, setActiveYear] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const months = ['all', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  // Extract unique sections from events
  const sections = ['all', ...Array.from(new Set(events.map(event => event.section)))];
  
  // Extract unique years from events or use current and recent years
  // Since the events data doesn't include years, we'll create sample years (current year and previous years)
  const currentYear = new Date().getFullYear();
  const years = ['all', currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];
  
  // Filter events based on month, section, year, and search term
  const filteredEvents = events.filter(event => {
    const matchMonth = activeMonth === 'all' || event.month === activeMonth;
    const matchSection = activeSection === 'all' || event.section === activeSection;
    // For demo purposes, assign events to different years
    const eventYear = determineEventYear(event.id, currentYear);
    const matchYear = activeYear === 'all' || eventYear === activeYear;
    const matchSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchMonth && matchSection && matchYear && matchSearch;
  });

  // Helper function to assign years to events based on ID
  // In a real app, this would come from your database
  function determineEventYear(id, currentYear) {
    if (id % 3 === 0) return (currentYear - 2).toString();
    if (id % 2 === 0) return (currentYear - 1).toString();
    return currentYear.toString();
  }

  // Group events by month for better organization when not filtered by month
  const eventsByMonth = {};
  months.forEach(month => {
    if (month !== 'all') {
      const monthEvents = filteredEvents.filter(event => event.month === month);
      if (monthEvents.length > 0) {
        eventsByMonth[month] = monthEvents;
      }
    }
  });
  
  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-900">Calendrier des Événements</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
              </div>
            </div>
            
            {/* Year selector - NEW */}
            <div className="w-full md:w-36">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                value={activeYear}
                onChange={(e) => setActiveYear(e.target.value)}
              >
                <option value="all">Toutes années</option>
                {years.filter(year => year !== 'all').map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Month selector */}
            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
              >
                <option value="all">Tous les mois</option>
                {months.filter(month => month !== 'all').map((month) => (
                  <option key={month} value={month}>
                    {month.charAt(0).toUpperCase() + month.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Section selector */}
            <div className="w-full md:w-48">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
              >
                <option value="all">Toutes les sections</option>
                {sections.filter(section => section !== 'all').map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-xl text-gray-500">Aucun événement trouvé</p>
              <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            activeMonth === 'all' ? (
              // Display events grouped by month when no month filter is applied
              Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <div key={month} className="mb-10">
                  <h3 className="text-xl font-bold mb-6 text-blue-900 border-b pb-2 capitalize">
                    {month}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {monthEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        year={determineEventYear(event.id, currentYear)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Display all filtered events without month grouping when a month filter is applied
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    year={determineEventYear(event.id, currentYear)}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer with action button */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, year }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-md font-semibold">
          {event.date}
        </div>
        {/* Year badge */}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 m-2 rounded-md text-sm">
          {year}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md mb-2">
          {event.section}
        </span>
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {event.location}
          </div>
          <button 
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300"
            aria-label={`Plus de détails sur ${event.title}`}
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllEventsModal;