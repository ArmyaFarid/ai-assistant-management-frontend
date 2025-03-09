export const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://srv645133.hstgr.cloud:9090' : 'http://localhost:9090' ;
export const API_BASE_URL = BASE_URL+"/api"
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#_/$%^&*])[A-Za-z\d!@_/#$%^&*]{8,15}$/;

