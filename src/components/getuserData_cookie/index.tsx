import Cookies from 'js-cookie';

export const getUserData = () => {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData) : null;
  };