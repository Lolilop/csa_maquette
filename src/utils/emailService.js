import { init, send } from 'emailjs-com';

// Initialize EmailJS with your User ID
// Note: In a production environment, these keys should be in environment variables
const EMAILJS_USER_ID = 'your_emailjs_user_id'; // Replace with actual User ID in production
const EMAILJS_SERVICE_ID = 'your_emailjs_service_id'; // Replace with actual Service ID in production
const EMAILJS_TEMPLATE_ID = 'your_emailjs_template_id'; // Replace with actual Template ID in production

/**
 * Initialize the EmailJS library
 */
const initEmailJS = () => {
  init(EMAILJS_USER_ID);
};

/**
 * Send section registration data via email
 * 
 * @param {Object} registrationData - The registration form data
 * @param {string} registrationData.lastName - User's last name
 * @param {string} registrationData.firstName - User's first name
 * @param {Array} registrationData.selectedSections - Array of selected sections with quantity and price
 * @param {string} registrationData.sections - Formatted string of sections info
 * @param {string} registrationData.totalPrice - Total price for all sections
 * @param {string} registrationData.email - User's email address
 * @param {string} registrationData.phone - User's phone number
 * @param {string} registrationData.message - Additional message from user
 * @param {File} registrationData.file - Attached file (will be mentioned in email but not attached)
 * @param {string} recipientEmail - The email address to send data to
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendSectionRegistrationEmail = async (registrationData, recipientEmail = 't.turquin@outlook.fr') => {
  // Prepare templateParams - add recipient email and format data for email template
  const sectionsSubject = registrationData.selectedSections.length > 1 
    ? 'Nouvelle inscription à plusieurs sections' 
    : `Nouvelle inscription à la section: ${registrationData.selectedSections[0]?.name || ''}`;
  
  const templateParams = {
    to_email: recipientEmail,
    from_name: `${registrationData.firstName} ${registrationData.lastName}`,
    from_email: registrationData.email,
    subject: sectionsSubject,
    message: registrationData.message || 'Aucun message complémentaire',
    user_data: `
      Nom: ${registrationData.lastName}
      Prénom: ${registrationData.firstName}
      Email: ${registrationData.email}
      Téléphone: ${registrationData.phone}
      
      SECTIONS SÉLECTIONNÉES:
      ${registrationData.sections}
      
      PRIX TOTAL: ${registrationData.totalPrice}
      
      ${registrationData.file ? `Document joint: ${registrationData.file.name}` : 'Aucun document joint'}
    `,
  };

  try {
    const response = await send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Send user registration data via email
 * 
 * @param {Object} userData - The user registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} recipientEmail - The email address to send data to
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendUserRegistrationEmail = async (userData, recipientEmail = 't.turquin@outlook.fr') => {
  // Prepare templateParams - add recipient email and format data for email template
  const templateParams = {
    to_email: recipientEmail,
    from_name: `${userData.firstName} ${userData.lastName}`,
    from_email: userData.email,
    subject: 'Nouvel utilisateur inscrit sur CSA',
    user_data: `
      Nom: ${userData.lastName}
      Prénom: ${userData.firstName}
      Email: ${userData.email}
    `,
  };

  try {
    const response = await send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Initialize EmailJS when this module is imported
initEmailJS();

export default {
  sendSectionRegistrationEmail,
  sendUserRegistrationEmail
};