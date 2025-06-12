import React, { useState, useRef, useEffect } from 'react';
import { sendSectionRegistrationEmail } from '../utils/emailService';
import { sections } from '../data/sections';

function MultiSectionRegistrationForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
    file: null,
    selectedSections: [],
    includeLicense: true,  // Whether to include license fee
    newLicenses: 1,       // Count of new licenses
    renewalLicenses: 0    // Count of renewal licenses
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [fileName, setFileName] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [sectionsModalOpen, setSectionsModalOpen] = useState(false);
  const [availableSections, setAvailableSections] = useState([]);
  
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // License fee configuration
  const LICENSE_FEES = {
    new: 70,      // 70€ for new registrations
    renewal: 40   // 40€ for renewals
  };
  
  // Calculate total price based on selected sections and license fee
  const sectionsTotalPrice = formData.selectedSections.reduce((total, sectionItem) => {
    return total + (sectionItem.price * sectionItem.quantity);
  }, 0);
  
  // Calculate license fees if applicable
  const newLicenseFee = formData.includeLicense ? LICENSE_FEES.new * formData.newLicenses : 0;
  const renewalLicenseFee = formData.includeLicense ? LICENSE_FEES.renewal * formData.renewalLicenses : 0;
  const totalLicenseFee = newLicenseFee + renewalLicenseFee;
  
  // Calculate total price including licenses if selected
  const totalPrice = sectionsTotalPrice + totalLicenseFee;
  
  // Load available sections from data
  useEffect(() => {
    // Process sections data to ensure it has all required fields
    const processedSections = sections.map(section => ({
      ...section,
      price: section.pricing ? parseFloat(section.pricing[0].split(':')[1].trim().replace('€', '')) : 180
    }));
    
    setAvailableSections(processedSections);
  }, []);
  
  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') handleClose();
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  // Auto-focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('lastName')?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle general input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs (for license toggle)
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'radio') {
      // Handle radio inputs (for license type)
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Handle other inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          file: 'Format de fichier non valide. Veuillez télécharger un PDF ou une image (JPEG, PNG).'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          file: 'Le fichier est trop volumineux. La taille maximale est de 5MB.'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file
      }));
      
      setFileName(file.name);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.target.classList.remove('border-blue-500', 'bg-blue-50');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Same validation as handleFileChange
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          file: 'Format de fichier non valide. Veuillez télécharger un PDF ou une image (JPEG, PNG).'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          file: 'Le fichier est trop volumineux. La taille maximale est de 5MB.'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file
      }));
      
      setFileName(file.name);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };
  
  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // State for recently added section (for showing success feedback)
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  // Clear the recently added notification after a delay
  useEffect(() => {
    if (recentlyAdded) {
      const timer = setTimeout(() => {
        setRecentlyAdded(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [recentlyAdded]);

  // Section management
  const addSection = (section, e) => {
    // Prevent event propagation to keep modal open
    if (e) e.stopPropagation();
    
    // Check if section already exists in selection
    const sectionExists = formData.selectedSections.find(s => s.id === section.id);
    
    if (sectionExists) {
      // Update quantity if section already exists
      updateSectionQuantity(section.id, sectionExists.quantity + 1);
    } else {
      // Add new section with quantity 1
      setFormData(prev => ({
        ...prev,
        selectedSections: [...prev.selectedSections, {
          id: section.id,
          name: section.name,
          quantity: 1,
          price: section.price || 180
        }]
      }));
    }

    // Set recently added section for visual feedback
    setRecentlyAdded(section.id);
    
    // Clear section selection error if it exists
    if (errors.sections) {
      setErrors(prev => ({ ...prev, sections: '' }));
    }
    
    // Explicitly prevent the modal from closing
    return false;
  };
  
  const removeSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.filter(section => section.id !== sectionId)
    }));
  };
  
  const updateSectionQuantity = (sectionId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    
    setFormData(prev => ({
      ...prev,
      selectedSections: prev.selectedSections.map(section => 
        section.id === sectionId ? { ...section, quantity: newQuantity } : section
      )
    }));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (formData.selectedSections.length === 0) {
      newErrors.sections = 'Veuillez sélectionner au moins une section';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Adresse email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^(?:\+\d{1,3}\s?)?\d{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    if (!formData.file) {
      newErrors.file = 'Veuillez joindre un document requis (carte d\'identité, certificat médical, etc.)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Modal handling
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: '',
        file: null,
        selectedSections: [],
        includeLicense: true,
        newLicenses: 1,
        renewalLicenses: 0
      });
      setErrors({});
      setSubmitStatus(null);
      setFileName('');
    }, 300);
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Format sections information for email
      const sectionsInfo = formData.selectedSections.map(section => {
        return `${section.name} (${section.quantity} personne${section.quantity > 1 ? 's' : ''} x ${section.price}€ = ${(section.quantity * section.price).toFixed(2)}€)`;
      }).join('\n');
      
      // Format license information for email
      let licenseInfo = "Pas de licence";
      if (formData.includeLicense) {
        const licenseDetails = [];
        
        if (formData.newLicenses > 0) {
          licenseDetails.push(`${formData.newLicenses} Nouvelle${formData.newLicenses > 1 ? 's' : ''} licence${formData.newLicenses > 1 ? 's' : ''} x ${LICENSE_FEES.new}€ = ${(formData.newLicenses * LICENSE_FEES.new).toFixed(2)}€`);
        }
        
        if (formData.renewalLicenses > 0) {
          licenseDetails.push(`${formData.renewalLicenses} Renouvellement${formData.renewalLicenses > 1 ? 's' : ''} x ${LICENSE_FEES.renewal}€ = ${(formData.renewalLicenses * LICENSE_FEES.renewal).toFixed(2)}€`);
        }
        
        if (licenseDetails.length > 0) {
          licenseInfo = `Licences CSA:\n${licenseDetails.join('\n')}\nTotal licences: ${totalLicenseFee.toFixed(2)}€`;
        } else {
          licenseInfo = "Licences CSA: 0€";
        }
      }
      
      // Create enhanced formData with selected sections and license info for email
      const enhancedFormData = {
        ...formData,
        sections: sectionsInfo,
        license: licenseInfo,
        sectionsTotalPrice: `${sectionsTotalPrice.toFixed(2)}€`,
        licenseFee: totalLicenseFee > 0 ? `${totalLicenseFee.toFixed(2)}€` : "0€",
        totalPrice: `${totalPrice.toFixed(2)}€`
      };
      
      // Send email with registration data
      await sendSectionRegistrationEmail(enhancedFormData, 't.turquin@outlook.fr');
      
      console.log('Form submitted successfully and email sent:', 
        {
          lastName: formData.lastName,
          firstName: formData.firstName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          sections: sectionsInfo,
          license: licenseInfo,
          sectionsTotalPrice: `${sectionsTotalPrice.toFixed(2)}€`,
          licenseFee: totalLicenseFee > 0 ? `${totalLicenseFee.toFixed(2)}€` : "0€",
          totalPrice: `${totalPrice.toFixed(2)}€`,
        },
        'File attached:', formData.file ? formData.file.name : 'None'
      );
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      handleClose();
    }
  };
  
  // State for section modal search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset search term when modal opens or closes
  useEffect(() => {
    if (sectionsModalOpen) {
      setSearchTerm('');
    }
  }, [sectionsModalOpen]);
  
  // Prevent modal close when clicking inside the modal
  const handleModalClick = (e) => {
    // Stop event from bubbling up to parent
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  // Sections selection modal
  const SectionSelectionModal = () => {
    if (!sectionsModalOpen) return null;
    
    // Filter out sections that are already selected
    const unselectedSections = availableSections.filter(section => 
      !formData.selectedSections.some(selected => selected.id === section.id)
    );
    
    // Filter sections based on search term
    const filteredSections = searchTerm.trim() !== '' ?
      unselectedSections.filter(section => 
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (section.description && section.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (section.category && section.category.toLowerCase().includes(searchTerm.toLowerCase()))
      ) : unselectedSections;
    
    // Group sections by category for better organization
    const groupedSections = {};
    
    // Group sections by category
    filteredSections.forEach(section => {
      const category = section.category || 'Autre';
      if (!groupedSections[category]) {
        groupedSections[category] = [];
      }
      groupedSections[category].push(section);
    });
    
    // Get categories and sort them
    const categories = Object.keys(groupedSections).sort();
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 overflow-x-hidden"
        onClick={handleModalClick} // Prevent click from propagating to parent
      >
        <div className="bg-white rounded-lg max-w-lg w-full shadow-xl p-6 max-h-[80vh] overflow-y-auto overflow-x-hidden break-words">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Choisir une section</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSectionsModalOpen(false)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                style={{minHeight: '44px'}}
              >
                <span className="mr-1">Terminé</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                onClick={() => setSectionsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                style={{minHeight: '44px', minWidth: '44px'}}
                aria-label="Fermer"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {unselectedSections.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Toutes les sections ont déjà été sélectionnées
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une section..."
                  className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  style={{minHeight: '44px'}}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Effacer la recherche"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {filteredSections.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2">Aucune section ne correspond à votre recherche</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              ) : searchTerm ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{filteredSections.length} résultat(s) trouvé(s)</p>
                  {filteredSections.map(section => (
                    <button
                      key={section.id}
                      onClick={(e) => {
                        addSection(section, e);
                        // Keep modal open after adding a section
                      }}
                      className={`flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left w-full ${recentlyAdded === section.id ? 'bg-green-50 border-green-300' : ''}`}
                      style={{minHeight: '60px'}}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{section.name}</div>
                          <div className="text-blue-600 font-bold">{section.price}€</div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-gray-500">
                            {section.schedule && <span className="mr-2">{section.schedule}</span>}
                            {section.location && <span>{section.location}</span>}
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {section.category || 'Autre'}
                          </div>
                        </div>
                        {section.description && <div className="text-xs text-gray-500 mt-1 break-words">{section.description}</div>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Sections by category */
                categories.map(category => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2 px-1">{category}</h4>
                    <div className="grid gap-3">
                      {groupedSections[category].map(section => (
                        <button
                          key={section.id}
                          onClick={(e) => {
                            addSection(section, e);
                            // Keep modal open after adding a section
                          }}
                          className={`flex items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors text-left ${recentlyAdded === section.id ? 'bg-green-50 border-green-300' : ''}`}
                          style={{minHeight: '60px'}}
                        >
                          <div className="w-full">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{section.name}</div>
                              <div className="text-blue-600 font-bold">{section.price}€</div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-xs text-gray-500">
                                {section.schedule && <span className="mr-2">{section.schedule}</span>}
                                {section.location && <span>{section.location}</span>}
                              </div>
                              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {section.category || 'Autre'}
                              </div>
                            </div>
                            {section.description && <div className="text-xs text-gray-500 mt-1 break-words">{section.description}</div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };


  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'bg-opacity-0' : 'bg-opacity-60'}`}
      onClick={handleClickOutside}
    >
      {/* Sections Selection Modal */}
      <SectionSelectionModal />
      
      <div 
        ref={formRef}
        className={`bg-white rounded-xl max-w-xl w-full shadow-2xl relative overflow-hidden transition-all duration-300 transform ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Inscription Multi-Sections</h3>
          </div>
          <p className="text-blue-100">
            Inscrivez-vous à plusieurs sections en une seule fois
          </p>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Inscription envoyée avec succès !</p>
                <p className="text-sm mt-1">Nous avons bien reçu votre demande d'inscription et un email a été envoyé avec vos informations. Nous vous contacterons bientôt.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium">Une erreur est survenue</p>
                <p className="text-sm mt-1">Veuillez réessayer ou nous contacter directement par téléphone.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre nom de famille"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre prénom"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre numéro de téléphone"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          
          {/* Sections Selection */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sections <span className="text-red-500">*</span>
            </label>
            
            {/* Already selected sections */}
            {formData.selectedSections.length > 0 ? (
              <div className="mb-3 space-y-3">
                {formData.selectedSections.map((selectedSection, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    {/* Section header with name and remove button */}
                    <div className="flex justify-between items-center px-4 py-3 bg-blue-50 border-b border-blue-100">
                      <div className="font-medium text-blue-800">{selectedSection.name}</div>
                      <button
                        type="button"
                        onClick={() => removeSection(selectedSection.id)}
                        className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        aria-label="Retirer cette section"
                        style={{minHeight: '40px', minWidth: '40px'}}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Section body with price and quantity selector */}
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-gray-600 mb-1">Prix unitaire:</div>
                          <div className="text-lg font-bold text-blue-700">{selectedSection.price} €</div>
                        </div>
                        
                        <div>
                          <div className="text-gray-600 mb-1">Nombre de personnes:</div>
                          <div className="flex items-center">
                            <button 
                              type="button" 
                              onClick={() => updateSectionQuantity(selectedSection.id, selectedSection.quantity - 1)}
                              className="w-10 h-10 rounded-l-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                              style={{minHeight: '44px'}}
                              disabled={selectedSection.quantity <= 1}
                            >
                              <svg className={`w-5 h-5 ${selectedSection.quantity <= 1 ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <div className="w-12 h-10 bg-white border-y border-gray-300 flex items-center justify-center text-lg font-medium" style={{minHeight: '44px'}}>
                              {selectedSection.quantity}
                            </div>
                            
                            <button 
                              type="button" 
                              onClick={() => updateSectionQuantity(selectedSection.id, selectedSection.quantity + 1)}
                              className="w-10 h-10 rounded-r-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                              style={{minHeight: '44px'}}
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Section subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                        <div className="text-sm text-gray-600">Sous-total:</div>
                        <div className="text-lg font-bold text-green-600">
                          {(selectedSection.quantity * selectedSection.price).toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            
            {/* Add more sections button */}
            <button
              type="button"
              onClick={() => setSectionsModalOpen(true)}
              className="flex items-center justify-center w-full p-3 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              style={{minHeight: '48px'}}
            >
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {formData.selectedSections.length === 0 ? "Sélectionner une section" : "Ajouter une autre section"}
            </button>
            
            {formData.selectedSections.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Vous avez sélectionné <span className="font-semibold">{formData.selectedSections.length}</span> section(s). 
                Pour ajouter plus de sections, cliquez sur le bouton ci-dessus.
              </div>
            )}
            
            {errors.sections && (
              <p className="mt-1 text-sm text-red-600">{errors.sections}</p>
            )}
            
            {/* Total price display */}
            {formData.selectedSections.length > 0 && (
              <div className="mt-5 rounded-lg overflow-hidden border border-green-200">
                <div className="bg-green-50 p-3 border-b border-green-100">
                  <h4 className="font-medium text-green-800">Récapitulatif de votre inscription</h4>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {formData.selectedSections.map((s, i) => (
                      <div key={i} className="flex justify-between text-sm flex-wrap gap-1">
                        <span className="break-words pr-2">{s.name}</span>
                        <span className="whitespace-nowrap">{s.quantity} × {s.price} € = {(s.quantity * s.price).toFixed(2)} €</span>
                      </div>
                    ))}
                    
                    {/* License fee section */}
                    <div className="mt-4 rounded-md bg-blue-50 p-3 mb-2">
                      <div className="font-medium text-blue-800 mb-2">Licence CSA</div>
                      
                      <div className="mb-3">
                        <label className="inline-flex items-center mb-2">
                          <input
                            type="checkbox"
                            name="includeLicense"
                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                            checked={formData.includeLicense}
                            onChange={handleChange}
                          />
                          <span className="ml-2 text-gray-700">Ajouter la licence CSA</span>
                        </label>
                        
                        {formData.includeLicense && (
                          <div className="ml-7 space-y-3">
                            <p className="text-sm text-gray-600">La licence est valable pour toutes les sections et pour une personne.</p>
                            
                            <div className="space-y-3">
                              {/* New licenses */}
                              <div>
                                <label className="block text-sm text-gray-700 mb-1">Nouvelles licences ({LICENSE_FEES.new} € chacune)</label>
                                <div className="flex items-center">
                                  <button 
                                    type="button" 
                                    onClick={() => formData.newLicenses > 0 && setFormData({...formData, newLicenses: formData.newLicenses - 1})}
                                    className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <input 
                                    type="number" 
                                    name="newLicenses"
                                    min="0"
                                    value={formData.newLicenses}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      if (value >= 0) {
                                        setFormData({...formData, newLicenses: value});
                                      }
                                    }}
                                    className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => setFormData({...formData, newLicenses: formData.newLicenses + 1})}
                                    className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </button>
                                </div>
                                {formData.newLicenses > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Total: {formData.newLicenses} × {LICENSE_FEES.new} € = {(formData.newLicenses * LICENSE_FEES.new).toFixed(2)} €
                                  </div>
                                )}
                              </div>
                              
                              {/* Renewal licenses */}
                              <div>
                                <label className="block text-sm text-gray-700 mb-1">Renouvellements de licence ({LICENSE_FEES.renewal} € chacun)</label>
                                <div className="flex items-center">
                                  <button 
                                    type="button" 
                                    onClick={() => formData.renewalLicenses > 0 && setFormData({...formData, renewalLicenses: formData.renewalLicenses - 1})}
                                    className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <input 
                                    type="number" 
                                    name="renewalLicenses"
                                    min="0"
                                    value={formData.renewalLicenses}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 0;
                                      if (value >= 0) {
                                        setFormData({...formData, renewalLicenses: value});
                                      }
                                    }}
                                    className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => setFormData({...formData, renewalLicenses: formData.renewalLicenses + 1})}
                                    className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </button>
                                </div>
                                {formData.renewalLicenses > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Total: {formData.renewalLicenses} × {LICENSE_FEES.renewal} € = {(formData.renewalLicenses * LICENSE_FEES.renewal).toFixed(2)} €
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {formData.includeLicense && (formData.newLicenses > 0 || formData.renewalLicenses > 0) && (
                        <div>
                          {formData.newLicenses > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>{formData.newLicenses} Nouvelle{formData.newLicenses > 1 ? 's' : ''} licence{formData.newLicenses > 1 ? 's' : ''}</span>
                              <span className="font-medium">{(formData.newLicenses * LICENSE_FEES.new).toFixed(2)} €</span>
                            </div>
                          )}
                          {formData.renewalLicenses > 0 && (
                            <div className="flex justify-between text-sm mt-1">
                              <span>{formData.renewalLicenses} Renouvellement{formData.renewalLicenses > 1 ? 's' : ''}</span>
                              <span className="font-medium">{(formData.renewalLicenses * LICENSE_FEES.renewal).toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm mt-1 font-medium text-blue-800">
                            <span>Total licences</span>
                            <span>{totalLicenseFee.toFixed(2)} €</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2 mt-2"></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 text-lg">TOTAL À PAYER:</span>
                    <span className="text-xl font-bold text-green-700">{totalPrice.toFixed(2)} €</span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Ce montant sera à régler après confirmation de votre inscription.
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Message / Additional Info */}
          <div className="mt-5">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message complémentaire
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              placeholder="Informations complémentaires pour votre inscription..."
            ></textarea>
          </div>


          {/* File Upload */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${errors.file ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                ref={fileInputRef}
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                {fileName ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">{fileName}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFile();
                      }}
                      className="ml-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Cliquez ou glissez-déposez un fichier ici</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPEG ou PNG (max. 5MB)</p>
                  </>
                )}
              </label>
            </div>
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-7">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-white transition-all ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </div>
              ) : (
                'Envoyer ma demande d\'inscription'
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              * Les champs marqués d'un astérisque sont obligatoires
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MultiSectionRegistrationForm;
