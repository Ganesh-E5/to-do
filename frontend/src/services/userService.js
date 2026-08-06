import api from "./api";

export const getProfile = () => api.get('/users/profile');

export const updateProfile = (data) => api.patch('/users/profile', data)

export const requestPasswordChangeOTP = () => api.post('/users/change-password/request')

export const verifyPasswordChangeOTP = (data) => api.post('/users/change-password/verify', data)