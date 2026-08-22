import { getUsers } from './users';

export const formatPhoneNumber = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');

    if (cleanNumber.length === 9) {
        return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    } else if (cleanNumber.length === 10) {
        return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }

    return phoneNumber;
};

export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return {
            isValid: false,
            error: 'מספר טלפון לא תקין'
        };
    }

    const cleanNumber = phoneNumber.replace(/[^\d]/g, '');

    if (cleanNumber.length < 9 || cleanNumber.length > 10) {
        return {
            isValid: false,
            error: 'מספר טלפון חייב להכיל 9-10 ספרות'
        };
    }

    const israeliPhonePattern = /^(0[2-9]|5[0-9])[0-9]{7,8}$/;
    if (!israeliPhonePattern.test(cleanNumber)) {
        return {
            isValid: false,
            error: 'מספר טלפון לא תואם לפורמט ישראלי'
        };
    }

    return {
        isValid: true,
        cleanNumber: cleanNumber,
        formattedNumber: formatPhoneNumber(cleanNumber)
    };
};

export const validateUserPhoneNumber = async (userId, providedPhone) => {
    try {
        const users = await getUsers();
        const user = users.find(u => u.id === userId || u.username === userId);

        if (!user) {
            return {
                isValid: false,
                error: 'משתמש לא נמצא'
            };
        }

        const phoneValidation = validatePhoneNumber(providedPhone);
        if (!phoneValidation.isValid) {
            return phoneValidation;
        }

        const userPhone = user.phone ? user.phone.replace(/[^\d]/g, '') : '';
        const providedPhoneClean = phoneValidation.cleanNumber;

        if (userPhone && userPhone !== providedPhoneClean) {
            return {
                isValid: false,
                error: 'מספר הטלפון לא תואם למשתמש המחובר'
            };
        }

        return {
            isValid: true,
            user: user,
            formattedNumber: phoneValidation.formattedNumber
        };

    } catch (error) {
        console.error('שגיאה בבדיקת מספר טלפון:', error);
        return {
            isValid: false,
            error: 'שגיאה בבדיקת מספר הטלפון'
        };
    }
};
