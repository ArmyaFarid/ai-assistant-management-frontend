export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:9090' : 'http://localhost:9090';
export const API_BASE_URL = BASE_URL+"/api"


export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#_/$%^&*])[A-Za-z\d!@_/#$%^&*]{8,15}$/;

