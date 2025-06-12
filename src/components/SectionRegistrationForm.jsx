import React, { useState, useRef, useEffect } from 'react';
import { sendSectionRegistrationEmail } from '../utils/emailService';
import { sections } from '../data/sections';

function SectionRegistrationForm({ isOpen, onClose, section = null }) {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    message: '',
    file: null,
    selectedSections: section ? [{
      id: section.id,
      name: section.name,
      quantity: 1,
      price: section.pricing ? parseFloat(section.pricing[0].split(':')[1].trim().replace('€', '')) : 0
    }] : []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [fileName, setFileName] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  
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

  // Calculate total price based on selected sections
  const totalPrice = formData.selectedSections.reduce((total, sectionItem) => {
    return total + (sectionItem.price * sectionItem.quantity);
  }, 0);
  
  // When section prop changes, update the form data
  useEffect(() => {
    if (section) {
      const sectionPrice = section.pricing ? parseFloat(section.pricing[0].split(':')[1].trim().replace('€', '')) : 0;
      setFormData(prev => ({
        ...prev,
        selectedSections: [{
          id: section.id,
          name: section.name,
          quantity: 1,
          price: sectionPrice
        }]
      }));
    }
  }, [section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      // Reset form after closing animation completes
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        message: '',
        file: null,
        selectedSections: section ? [{
          id: section.id,
          name: section.name,
          quantity: 1,
          price: section.pricing ? parseFloat(section.pricing[0].split(':')[1].trim().replace('€', '')) : 0
        }] : []
      });
      setErrors({});
      setSubmitStatus(null);
      setFileName('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a FormData object to handle file upload
      const emailFormData = new FormData();
      emailFormData.append('lastName', formData.lastName);
      emailFormData.append('firstName', formData.firstName);
      emailFormData.append('email', formData.email);
      emailFormData.append('phone', formData.phone);
      emailFormData.append('message', formData.message);
      
      // Add sections data
      const sectionsInfo = formData.selectedSections.map(section => {
        return `${section.name} (${section.quantity} personne${section.quantity > 1 ? 's' : ''} x ${section.price}€ = ${(section.quantity * section.price).toFixed(2)}€)`;
      }).join('\n');
      
      emailFormData.append('sections', sectionsInfo);
      emailFormData.append('totalPrice', `${totalPrice.toFixed(2)}€`);
      
      if (formData.file) {
        emailFormData.append('file', formData.file);
      }
      
      // Create enhanced formData with selected sections info for email
      const enhancedFormData = {
        ...formData,
        sections: sectionsInfo,
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

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'bg-opacity-0' : 'bg-opacity-60'}`}
      onClick={handleClickOutside}
    >
      <div 
        ref={formRef}
        className={`bg-white rounded-xl max-w-xl w-full shadow-2xl relative overflow-hidden transition-all duration-300 transform ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} max-h-[90vh] overflow-y-auto mx-auto`}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Inscription à une section</h3>
          </div>
          <p className="text-blue-100">
            {section 
              ? `Formulaire d'inscription pour la section "${section.name}"` 
              : "Merci de remplir tous les champs requis pour vous inscrire à une section"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre nom de famille"
                style={{minHeight: '44px'}}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre prénom"
                style={{minHeight: '44px'}}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            {/* Sections Selection */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sections <span className="text-red-500">*</span>
              </label>
              
              {/* Already selected sections */}
              {formData.selectedSections.length > 0 ? (
                <div className="mb-3 space-y-3">
                  {formData.selectedSections.map((selectedSection, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex-grow">
                        <div className="font-medium text-blue-800">{selectedSection.name}</div>
                        <div className="text-xs text-blue-700">{selectedSection.price} € par personne</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700 whitespace-nowrap">Nombre de personnes:</label>
                        <div className="flex items-center">
                          <button 
                            type="button" 
                            onClick={() => {
                              if (selectedSection.quantity > 1) {
                                const updatedSections = [...formData.selectedSections];
                                updatedSections[index].quantity--;
                                setFormData({...formData, selectedSections: updatedSections});
                              }
                            }}
                            className="w-10 h-10 rounded-l-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors min-h-[44px]"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <div className="w-12 h-10 bg-white border-y border-gray-300 flex items-center justify-center text-lg font-medium">
                            {selectedSection.quantity}
                          </div>
                          
                          <button 
                            type="button" 
                            onClick={() => {
                              const updatedSections = [...formData.selectedSections];
                              updatedSections[index].quantity++;
                              setFormData({...formData, selectedSections: updatedSections});
                            }}
                            className="w-10 h-10 rounded-r-md bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors min-h-[44px]"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Only show remove button if not forced by parent component */}
                      {!section && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSections = formData.selectedSections.filter((_, i) => i !== index);
                            setFormData({...formData, selectedSections: updatedSections});
                          }}
                          className="p-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          aria-label="Retirer cette section"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
              
              {/* Add more sections button if not forced by parent */}
              {!section && (
                <button
                  type="button"
                  onClick={() => {
                    // Open a section selection modal or dropdown
                    // For now, we'll just add a placeholder section
                    setFormData({
                      ...formData,
                      selectedSections: [...formData.selectedSections, {
                        id: sections[0].id,
                        name: sections[0].name,
                        quantity: 1,
                        price: sections[0].pricing ? parseFloat(sections[0].pricing[0].split(':')[1].trim().replace('€', '')) : 180
                      }]
                    });
                  }}
                  className="flex items-center justify-center w-full p-2 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter une section
                </button>
              )}
              
              {errors.sections && (
                <p className="mt-1 text-sm text-red-600">{errors.sections}</p>
              )}
              
              {/* Total price display */}
              {formData.selectedSections.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Prix total:</span>
                    <span className="text-lg font-bold text-blue-700">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {formData.selectedSections.map((s, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{s.name}</span>
                        <span>{s.quantity} × {s.price} € = {(s.quantity * s.price).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="votre@email.com"
                style={{minHeight: '44px'}}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
                placeholder="Votre numéro de téléphone"
                style={{minHeight: '44px'}}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              placeholder="Informations complémentaires pour votre inscription..."
              style={{minHeight: '80px'}}
            ></textarea>
          </div>
          
          {/* File Upload */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document requis <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal"> (Carte d'identité, certificat médical, etc.)</span>
            </label>
            <div 
              className={`mt-1 flex justify-center px-4 sm:px-6 py-5 border-2 border-dashed rounded-lg transition-all ${
                errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{minHeight: '100px'}}
            >
              <div className="space-y-2 text-center">
                <svg 
                  className={`mx-auto h-12 w-12 ${errors.file ? 'text-red-400' : 'text-gray-400'}`} 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 48 48" 
                  aria-hidden="true"
                >
                  <path 
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                    strokeWidth={2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                
                {fileName ? (
                  <div className="flex items-center justify-center flex-col">
                    <p className="text-sm text-gray-700">
                      Fichier sélectionné: <span className="font-medium">{fileName}</span>
                    </p>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex text-sm text-gray-600">
                      <label 
                        htmlFor="file-upload" 
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Télécharger un fichier</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG jusqu'à 5MB</p>
                  </>
                )}
              </div>
            </div>
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
          
          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              className={`w-full py-4 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
              style={{minHeight: '54px'}}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </div>
              ) : 'Envoyer ma demande d\'inscription'}
            </button>
          </div>
          
          {/* Privacy note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              En soumettant ce formulaire, vous acceptez que les informations saisies soient utilisées pour votre inscription au CSA.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SectionRegistrationForm;