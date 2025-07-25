/**
 * Utilidades de validación
 */

export const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
        return `${fieldName} es requerido`;
    }
    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Formato de email inválido';
    }
    return null;
};

export const validateLength = (value, fieldName, min = 0, max = Infinity) => {
    if (value.length < min) {
        return `${fieldName} debe tener al menos ${min} caracteres`;
    }
    if (value.length > max) {
        return `${fieldName} no puede tener más de ${max} caracteres`;
    }
    return null;
};

export const validateLogin = (documento, password) => {
    const errors = [];

    const docError = validateRequired(documento, 'Documento');
    if (docError) errors.push({ field: 'documento', message: docError });

    const passError = validateRequired(password, 'Contraseña');
    if (passError) errors.push({ field: 'password', message: passError });

    return errors;
}; 