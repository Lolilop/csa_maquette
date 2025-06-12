import { useState, useEffect, useRef } from 'react';

function OrganizationModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

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
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-900">Le Centre Sportif et Artistique</h2>
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
        
        {/* Content */}
        <div className="p-6">
          {/* Introduction */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Notre Mission</h3>
            <p className="text-gray-700 mb-4">
              Le Centre Sportif et Artistique (CSA) est une association à but non lucratif dédiée à promouvoir la pratique d'activités sportives
              et artistiques dans un cadre convivial et bienveillant. Depuis notre création en 1985, notre objectif est de rendre accessible 
              à tous des activités variées, encadrées par des animateurs passionnés et compétents.
            </p>
            <p className="text-gray-700">
              Nous croyons que la pratique d'activités sportives et artistiques contribue au bien-être physique et mental,
              favorise le lien social et permet l'épanouissement personnel. C'est pourquoi nous nous engageons à offrir un 
              environnement inclusif où chacun peut développer ses talents, progresser à son rythme et partager sa passion.
            </p>
          </section>

          {/* Values */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Nos Valeurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Inclusion</h4>
                <p className="text-sm text-gray-600">Nos activités sont accessibles à tous, quels que soient l'âge, le niveau ou les capacités.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Bienveillance</h4>
                <p className="text-sm text-gray-600">Un environnement respectueux où chacun peut s'épanouir sans jugement.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h4 className="font-bold mb-1">Dynamisme</h4>
                <p className="text-sm text-gray-600">Une énergie positive et communicative qui motive chacun à se dépasser.</p>
              </div>
            </div>
          </section>

          {/* Organizational Chart */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-6 text-blue-800">Notre Organigramme</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              {/* President Level */}
              <div className="flex justify-center mb-8">
                <div className="bg-blue-700 text-white rounded-lg shadow-lg p-4 w-64 text-center">
                  <h4 className="font-bold">Président(e)</h4>
                  <p className="text-sm mt-1">Marie Dupont</p>
                </div>
              </div>
              
              {/* Vice Presidents Level */}
              <div className="flex justify-center space-x-6 mb-8">
                <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 w-56 text-center">
                  <h4 className="font-bold">Vice-Président(e) Sports</h4>
                  <p className="text-sm mt-1">Thomas Laurent</p>
                </div>
                <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 w-56 text-center">
                  <h4 className="font-bold">Vice-Président(e) Arts</h4>
                  <p className="text-sm mt-1">Sophie Martin</p>
                </div>
              </div>
              
              {/* Administrative Level */}
              <div className="flex justify-center space-x-4 mb-8">
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-44 text-center">
                  <h4 className="font-bold">Secrétaire Général(e)</h4>
                  <p className="text-sm mt-1">Lucas Bernard</p>
                </div>
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-44 text-center">
                  <h4 className="font-bold">Trésorier(ère)</h4>
                  <p className="text-sm mt-1">Émilie Petit</p>
                </div>
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-44 text-center">
                  <h4 className="font-bold">Responsable Communication</h4>
                  <p className="text-sm mt-1">Julien Moreau</p>
                </div>
              </div>
              
              {/* Section Leaders */}
              <div className="flex justify-center mb-4">
                <h5 className="font-semibold text-gray-700">Responsables de Sections</h5>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-400 text-white rounded-lg shadow p-3 text-center">
                  <h4 className="font-bold text-sm">Sports Collectifs</h4>
                  <p className="text-xs mt-1">Alexandre Dubois</p>
                </div>
                <div className="bg-blue-400 text-white rounded-lg shadow p-3 text-center">
                  <h4 className="font-bold text-sm">Sports Individuels</h4>
                  <p className="text-xs mt-1">Nathalie Leroy</p>
                </div>
                <div className="bg-blue-400 text-white rounded-lg shadow p-3 text-center">
                  <h4 className="font-bold text-sm">Arts Plastiques</h4>
                  <p className="text-xs mt-1">Philippe Durand</p>
                </div>
                <div className="bg-blue-400 text-white rounded-lg shadow p-3 text-center">
                  <h4 className="font-bold text-sm">Arts Vivants</h4>
                  <p className="text-xs mt-1">Camille Girard</p>
                </div>
              </div>
            </div>
          </section>

          {/* Membership Info */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-blue-800">Adhésion au CSA</h3>
            <p className="text-gray-700 mb-4">
              Devenir membre du CSA, c'est rejoindre une communauté dynamique et passionnée. L'adhésion vous permet de :
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-700">
              <li>Participer à une ou plusieurs activités de votre choix</li>
              <li>Accéder à nos installations et équipements</li>
              <li>Participer aux événements organisés par le club</li>
              <li>Bénéficier de tarifs préférentiels pour les stages et formations</li>
              <li>Contribuer au développement de notre association</li>
            </ul>
            <p className="font-medium text-blue-700">
              Pour toute demande d'adhésion, rendez-vous dans la section "Contact" ou inscrivez-vous directement via le site.
            </p>
          </section>
        </div>

        {/* Footer with action buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Fermer
          </button>
          <a 
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
}

export default OrganizationModal;