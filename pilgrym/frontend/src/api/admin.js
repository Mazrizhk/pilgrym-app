import api from './axios';

export const getStats = () => api.get('/admin/stats').then((r) => r.data);
export const getAllUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);
export const adminCreateUser = (data) => api.post('/admin/users', data).then((r) => r.data);
export const adminUpdateUser = (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
