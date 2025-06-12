import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function AdminSectionEditor({ section, onSave, onCancel }) {
  // Initialize state with section data or default values
  const [formData, setFormData] = useState({
    id: section?.id || '',
    name: section?.name || '',
    hasDetailPage: section?.hasDetailPage || false,
    detailPageContent: section?.detailPageContent || {
      heroTitle: section?.name || '',
      heroSubtitle: section?.description || '',
      sections: [
        {
          title: 'Présentation',
          content: `<p>${section?.fullDescription || section?.description || ''}</p>`
        }
      ],
      galleryImages: []
    }
  });

  // Track edit status for validation
  const [isEdited, setIsEdited] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [contentSections, setContentSections] = useState(
    formData.detailPageContent.sections || []
  );

  // Update content sections when section data changes
  useEffect(() => {
    if (section?.detailPageContent?.sections) {
      setContentSections(section.detailPageContent.sections);
    }
  }, [section]);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIsEdited(true);
    
    if (name.startsWith('heroContent.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        detailPageContent: {
          ...prev.detailPageContent,
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle content section changes
  const handleSectionChange = (index, field, value) => {
    setIsEdited(true);
    const updatedSections = [...contentSections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setContentSections(updatedSections);
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        sections: updatedSections
      }
    }));
  };

  // Add a new content section
  const addSection = () => {
    setIsEdited(true);
    const newSection = {
      title: `Nouvelle section ${contentSections.length + 1}`,
      content: '<p>Contenu de la section...</p>'
    };
    
    const updatedSections = [...contentSections, newSection];
    setContentSections(updatedSections);
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        sections: updatedSections
      }
    }));
  };

  // Remove a content section
  const removeSection = (index) => {
    setIsEdited(true);
    const updatedSections = contentSections.filter((_, i) => i !== index);
    setContentSections(updatedSections);
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        sections: updatedSections
      }
    }));
  };

  // Move section up or down in the list
  const moveSection = (index, direction) => {
    setIsEdited(true);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === contentSections.length - 1)
    ) {
      return;
    }

    const updatedSections = [...contentSections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[newIndex]] = 
    [updatedSections[newIndex], updatedSections[index]];
    
    setContentSections(updatedSections);
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        sections: updatedSections
      }
    }));
  };

  // Handle gallery image additions
  const handleAddGalleryImage = () => {
    if (!tempImageUrl.trim()) return;
    
    setIsEdited(true);
    const updatedImages = [
      ...(formData.detailPageContent.galleryImages || []),
      tempImageUrl
    ];
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        galleryImages: updatedImages
      }
    }));
    
    setTempImageUrl('');
  };

  // Remove a gallery image
  const handleRemoveGalleryImage = (index) => {
    setIsEdited(true);
    const updatedImages = formData.detailPageContent.galleryImages.filter(
      (_, i) => i !== index
    );
    
    setFormData(prev => ({
      ...prev,
      detailPageContent: {
        ...prev.detailPageContent,
        galleryImages: updatedImages
      }
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hasDetailPage) {
      return true; // No validation needed if detail page is disabled
    }
    
    if (!formData.detailPageContent.heroTitle.trim()) {
      newErrors.heroTitle = "Le titre principal est requis";
    }
    
    if (!formData.detailPageContent.heroSubtitle.trim()) {
      newErrors.heroSubtitle = "Le sous-titre est requis";
    }
    
    if (contentSections.length === 0) {
      newErrors.sections = "Au moins une section de contenu est requise";
    } else {
      contentSections.forEach((section, index) => {
        if (!section.title.trim()) {
          newErrors[`section_${index}_title`] = `Le titre de la section ${index + 1} est requis`;
        }
        if (!section.content.trim()) {
          newErrors[`section_${index}_content`] = `Le contenu de la section ${index + 1} est requis`;
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updatedSection = {
      ...section,
      ...formData,
      hasDetailPage: formData.hasDetailPage,
      detailPageContent: formData.hasDetailPage ? formData.detailPageContent : null
    };
    
    onSave(updatedSection);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {section.hasDetailPage ? 'Modifier' : 'Créer'} la page de section: {section.name}
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:text-blue-100 focus:outline-none"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          {/* Tabs */}
          <div className="bg-gray-100 px-6 py-2 border-b flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Général
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!formData.hasDetailPage}
            >
              Contenu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!formData.hasDetailPage}
            >
              Galerie
            </button>
          </div>
          
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div>
                <div className="mb-6">
                  <label className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      name="hasDetailPage"
                      checked={formData.hasDetailPage}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">Activer la page dédiée pour cette section</span>
                  </label>
                  
                  {formData.hasDetailPage && (
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <div>
                        <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Titre principal
                        </label>
                        <input
                          type="text"
                          id="heroTitle"
                          name="heroContent.heroTitle"
                          value={formData.detailPageContent.heroTitle}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.heroTitle
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                        {errors.heroTitle && (
                          <p className="mt-1 text-sm text-red-600">{errors.heroTitle}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Sous-titre
                        </label>
                        <input
                          type="text"
                          id="heroSubtitle"
                          name="heroContent.heroSubtitle"
                          value={formData.detailPageContent.heroSubtitle}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.heroSubtitle
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                        {errors.heroSubtitle && (
                          <p className="mt-1 text-sm text-red-600">{errors.heroSubtitle}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {!formData.hasDetailPage && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Pas de page dédiée</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Activez l'option ci-dessus pour créer une page dédiée pour cette section. 
                            Cela permettra aux visiteurs d'accéder à un contenu détaillé à partir de la carte de la section.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Content Tab */}
            {activeTab === 'content' && formData.hasDetailPage && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sections de contenu</h3>
                  <p className="text-sm text-gray-500">
                    Organisez le contenu de votre page en sections. Chaque section aura un titre et du contenu HTML.
                  </p>
                </div>
                
                {errors.sections && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.sections}
                  </div>
                )}
                
                <div className="space-y-6">
                  {contentSections.map((section, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-md p-4 bg-white"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Section {index + 1}</h4>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded-full ${
                              index === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Déplacer vers le haut"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === contentSections.length - 1}
                            className={`p-1 rounded-full ${
                              index === contentSections.length - 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Déplacer vers le bas"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(index)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-50"
                            title="Supprimer cette section"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label 
                            htmlFor={`section-title-${index}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Titre
                          </label>
                          <input
                            type="text"
                            id={`section-title-${index}`}
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                            className={`block w-full rounded-md shadow-sm sm:text-sm ${
                              errors[`section_${index}_title`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors[`section_${index}_title`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`section_${index}_title`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label 
                            htmlFor={`section-content-${index}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Contenu (HTML)
                          </label>
                          <textarea
                            id={`section-content-${index}`}
                            value={section.content}
                            onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                            rows={6}
                            className={`block w-full rounded-md shadow-sm sm:text-sm font-mono ${
                              errors[`section_${index}_content`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }`}
                          />
                          {errors[`section_${index}_content`] && (
                            <p className="mt-1 text-sm text-red-600">{errors[`section_${index}_content`]}</p>
                          )}
                          
                          <div className="mt-2 text-sm text-gray-500">
                            <p>Utilisez du HTML pour mettre en forme le contenu, par exemple:</p>
                            <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                              <li><code>&lt;p&gt;...&lt;/p&gt;</code> pour les paragraphes</li>
                              <li><code>&lt;strong&gt;...&lt;/strong&gt;</code> pour le texte en gras</li>
                              <li><code>&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code> pour les listes</li>
                            </ul>
                          </div>
                          
                          <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Aperçu:</h5>
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter une section
                  </button>
                </div>
              </div>
            )}
            
            {/* Gallery Tab */}
            {activeTab === 'gallery' && formData.hasDetailPage && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Galerie d'images</h3>
                  <p className="text-sm text-gray-500">
                    Ajoutez des images pour illustrer la page de votre section.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {/* Image input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempImageUrl}
                      onChange={(e) => setTempImageUrl(e.target.value)}
                      placeholder="URL de l'image (ex: /assets/images/example.jpg)"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      disabled={!tempImageUrl.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {/* Preview help text */}
                  <div className="text-sm text-gray-500">
                    <p>
                      Pour les images, utilisez des chemins relatifs au dossier public. 
                      Par exemple : <code>/assets/images/nom-image.jpg</code>
                    </p>
                  </div>
                  
                  {/* Gallery preview */}
                  {formData.detailPageContent.galleryImages && formData.detailPageContent.galleryImages.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Images de la galerie:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.detailPageContent.galleryImages.map((image, index) => (
                          <div key={index} className="group relative rounded-lg overflow-hidden h-40 bg-gray-100 border border-gray-200">
                            <img 
                              src={image} 
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/assets/images/image-placeholder.jpg';
                                e.target.onerror = null;
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(index)}
                                className="p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Supprimer cette image"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Aucune image dans la galerie
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Ajoutez des images pour créer une galerie attractive
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          
          <div>
            {!formData.hasDetailPage && (
              <span className="text-sm text-yellow-600 mr-3">
                Page dédiée désactivée
              </span>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isEdited}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isEdited
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AdminSectionEditor.propTypes = {
  section: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AdminSectionEditor;