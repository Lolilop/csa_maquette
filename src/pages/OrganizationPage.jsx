import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OrganizationPage() {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return (
    <div className="font-[Montserrat] bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Header Banner */}
        <div className="bg-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Le Centre Sportif et Artistique</h1>
            <p className="text-xl max-w-3xl">
              Découvrez notre organisation, notre mission et comment nous rejoindre
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Introduction */}
          <section className="mb-16 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Notre Mission</h2>
            <p className="text-gray-700 mb-4">
              Le Centre Sportif et Artistique (CSA) est une association à but non lucratif dédiée à promouvoir la pratique d'activités sportives
              et artistiques dans un cadre convivial et bienveillant. Depuis notre création en 1985, notre objectif est de rendre accessible 
              à tous des activités variées, encadrées par des animateurs passionnés et compétents.
            </p>
            <p className="text-gray-700 mb-4">
              Nous croyons que la pratique d'activités sportives et artistiques contribue au bien-être physique et mental,
              favorise le lien social et permet l'épanouissement personnel. C'est pourquoi nous nous engageons à offrir un 
              environnement inclusif où chacun peut développer ses talents, progresser à son rythme et partager sa passion.
            </p>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <div className="text-blue-600 mb-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Inclusion</h3>
                <p className="text-gray-600">Nos activités sont accessibles à tous, quels que soient l'âge, le niveau ou les capacités. Nous croyons que la diversité enrichit notre communauté.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <div className="text-blue-600 mb-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Bienveillance</h3>
                <p className="text-gray-600">Un environnement respectueux où chacun peut s'épanouir sans jugement et où l'entraide est encouragée à tous les niveaux.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <div className="text-blue-600 mb-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Dynamisme</h3>
                <p className="text-gray-600">Une énergie positive et communicative qui motive chacun à se dépasser et à explorer de nouveaux horizons dans sa pratique.</p>
              </div>
            </div>
          </section>

          {/* Organizational Chart */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Notre Organigramme</h2>
            <div className="bg-gray-50 p-6 rounded-xl border">
              {/* President Level */}
              <div className="flex justify-center mb-8">
                <div className="bg-blue-700 text-white rounded-lg shadow-lg p-4 w-64 text-center">
                  <h4 className="font-bold">Président(e)</h4>
                  <p className="text-sm mt-1">Marie Dupont</p>
                </div>
              </div>
              
              {/* Vice Presidents Level */}
              <div className="flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0 mb-8">
                <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 w-full md:w-56 text-center">
                  <h4 className="font-bold">Vice-Président(e) Sports</h4>
                  <p className="text-sm mt-1">Thomas Laurent</p>
                </div>
                <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 w-full md:w-56 text-center">
                  <h4 className="font-bold">Vice-Président(e) Arts</h4>
                  <p className="text-sm mt-1">Sophie Martin</p>
                </div>
              </div>
              
              {/* Administrative Level */}
              <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0 mb-8">
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-full md:w-44 text-center">
                  <h4 className="font-bold">Secrétaire Général(e)</h4>
                  <p className="text-sm mt-1">Lucas Bernard</p>
                </div>
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-full md:w-44 text-center">
                  <h4 className="font-bold">Trésorier(ère)</h4>
                  <p className="text-sm mt-1">Émilie Petit</p>
                </div>
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-4 w-full md:w-44 text-center">
                  <h4 className="font-bold">Responsable Communication</h4>
                  <p className="text-sm mt-1">Julien Moreau</p>
                </div>
              </div>
              
              {/* Section Leaders */}
              <div className="flex justify-center mb-4">
                <h5 className="font-semibold text-gray-700">Responsables de Sections</h5>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Adhésion au CSA</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">
                Devenir membre du CSA, c'est rejoindre une communauté dynamique et passionnée. L'adhésion vous permet de :
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li className="mb-2">Participer à une ou plusieurs activités de votre choix</li>
                <li className="mb-2">Accéder à nos installations et équipements</li>
                <li className="mb-2">Participer aux événements organisés par le club</li>
                <li className="mb-2">Bénéficier de tarifs préférentiels pour les stages et formations</li>
                <li className="mb-2">Contribuer au développement de notre association</li>
              </ul>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-lg mb-2 text-blue-800">Comment adhérer ?</h3>
                <p className="mb-4">Pour rejoindre le CSA, plusieurs options s'offrent à vous :</p>
                <ol className="list-decimal pl-5 mb-4">
                  <li className="mb-2">En ligne : inscrivez-vous directement via ce site dans la section correspondant à l'activité de votre choix</li>
                  <li className="mb-2">Sur place : venez nous rencontrer pendant nos horaires d'ouverture</li>
                  <li className="mb-2">Par téléphone : contactez notre secrétariat qui vous guidera dans vos démarches</li>
                </ol>
              </div>
              
              <div className="mt-6 flex flex-col md:flex-row justify-center gap-6">
                <Link to="/sections" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md text-center">
                  Découvrir nos sections
                </Link>
                <Link 
                  to="/" 
                  onClick={() => {
                    // Add small delay to ensure navigation completes before scrolling
                    setTimeout(() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        const navHeight = document.querySelector('nav')?.offsetHeight || 80;
                        window.scrollTo({
                          top: contactSection.offsetTop - navHeight,
                          behavior: 'smooth'
                        });
                      }
                    }, 100);
                  }}
                  className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-center"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default OrganizationPage;