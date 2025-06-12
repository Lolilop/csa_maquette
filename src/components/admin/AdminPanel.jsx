import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sections } from '../../data/sections';
import AdminSectionEditor from './AdminSectionEditor';
import routes from '../../utils/routes';
import { useUser } from '../../context/UserContext';

function AdminPanel() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState(null);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
  
  // Simulated admin credentials (in a real app, this would be server-side)
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'csa2024';
  
  // Check if user is admin on mount and when user changes
  useEffect(() => {
    if (!isLoading) {
      // Check if they have admin role or admin session
      const hasAdminRole = user?.role === 'admin';
      const hasAdminSession = sessionStorage.getItem('csaAdminLoggedIn') === 'true';
      setIsAdmin(hasAdminRole || hasAdminSession);
    }
  }, [user, isLoading]);
  
  // Filter sections based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSections([...sections]);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sections.filter(
        section => 
          section.name.toLowerCase().includes(query) || 
          section.category.toLowerCase().includes(query)
      );
      setFilteredSections(filtered);
    }
  }, [searchQuery, sections]);
  
  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Set authentication state
      setIsAdmin(true);
      sessionStorage.setItem('csaAdminLoggedIn', 'true');
      setUsername('');
      setPassword('');
    } else {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };
  
  // Get logout function from context
  const { logout: userLogout } = useUser();
  
  // Handle logout
  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('csaAdminLoggedIn');
    // If the user was logged in through UserContext, also log them out there
    if (user) {
      userLogout();
    }
    navigate(routes.home); // Return to homepage instead of staying in admin
  };
  
  // Handle saving section changes
  const handleSaveSection = (updatedSection) => {
    // In a real application, this would send the updated section data to a backend API
    
    // Simulate a successful update
    console.log('Section updated:', updatedSection);
    
    // Update the section in the local state
    const updatedSections = sections.map(section => {
      if (section.id === updatedSection.id) {
        return { ...section, ...updatedSection };
      }
      return section;
    });
    
    // Show success message
    setUpdateMessage({
      text: `La section "${updatedSection.name}" a été mise à jour avec succès.`,
      type: 'success'
    });
    
    // Clear message after 5 seconds
    setTimeout(() => setUpdateMessage({ text: '', type: '' }), 5000);
    
    // Close the editor
    setEditingSection(null);
  };
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show login screen if not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Panneau d'administration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour gérer les pages des sections
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Se connecter
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
              Retourner à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If authenticated, show admin panel
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Panneau d'administration CSA
          </h1>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900"
              title="Voir le site"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success/error message */}
        {updateMessage.text && (
          <div className={`mb-6 p-4 rounded-md ${updateMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {updateMessage.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{updateMessage.text}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Section list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Gestion des pages des sections
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Sélectionnez une section pour éditer sa page dédiée
              </p>
            </div>
            <div className="w-full sm:w-64">
              <label htmlFor="search" className="sr-only">Rechercher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher une section..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {filteredSections.map(section => (
                <li key={section.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 mr-4">
                        <img 
                          src={section.image} 
                          alt={section.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = '/assets/images/image-placeholder.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{section.name}</h3>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium 
                            ${section.hasDetailPage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {section.hasDetailPage ? 'Page active' : 'Pas de page'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate max-w-xs sm:max-w-sm md:max-w-md">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {section.hasDetailPage && (
                        <Link
                          to={routes.getHashSectionDetailRoute(section.id)}
                          target="_blank"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Voir
                        </Link>
                      )}
                      
                      <button
                        onClick={() => setEditingSection(section)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {section.hasDetailPage ? 'Modifier' : 'Créer'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              
              {filteredSections.length === 0 && (
                <li className="px-4 py-8 text-center text-gray-500">
                  Aucune section trouvée pour votre recherche.
                </li>
              )}
            </ul>
          </div>
        </div>
      </main>
      
      {/* Section Editor Modal */}
      {editingSection && (
        <AdminSectionEditor 
          section={editingSection}
          onSave={handleSaveSection}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}

export default AdminPanel;