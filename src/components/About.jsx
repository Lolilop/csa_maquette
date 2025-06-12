import { Link } from 'react-router-dom';
import routes from '../utils/routes';

function About() {
  return (
    <section id="about" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-900">À Propos du CSA</h2>
            <p className="text-gray-700 mb-4">
              Notre Club Sportif et Artistique offre un espace convivial où chacun peut explorer 
              ses passions, développer ses talents et partager des moments inoubliables.
            </p>
            <p className="text-gray-700 mb-4">
              Fondé en 1985, le CSA a progressivement enrichi son offre d'activités pour répondre 
              aux attentes d'un public diversifié, des plus jeunes aux seniors. Aujourd'hui, 
              nous proposons plus de 20 sections différentes encadrées par des animateurs passionnés.
            </p>
            <p className="text-gray-700 mb-6">
              Notre philosophie : permettre à chacun de pratiquer une activité dans un cadre 
              bienveillant et motivant, favorisant le partage, le progrès personnel et la convivialité.
            </p>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              <div className="bg-white p-5 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600">20+</div>
                <div className="text-gray-600">Sections</div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600">1200+</div>
                <div className="text-gray-600">Membres</div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600">35+</div>
                <div className="text-gray-600">Animateurs</div>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600">38</div>
                <div className="text-gray-600">Années</div>
              </div>
            </div>
            
            <Link 
              to={routes.organization}
              className="inline-flex items-center bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
            >
              Rejoignez-nous
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg h-64">
                <img 
                  src="/assets/images/about-1.jpg" 
                  alt="Activité au CSA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg h-64 transform translate-y-8">
                <img 
                  src="/assets/images/about-2.jpg" 
                  alt="Activité au CSA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg h-64 transform translate-y-4">
                <img 
                  src="/assets/images/about-3.jpg" 
                  alt="Activité au CSA" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg h-64">
                <img 
                  src="/assets/images/about-4.jpg" 
                  alt="Activité au CSA" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default About;