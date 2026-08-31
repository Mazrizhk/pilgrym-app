import api from './axios';

export const getPackages = (params) => api.get('/packages', { params }).then((r) => r.data);
export const getPackageById = (id) => api.get(`/packages/${id}`).then((r) => r.data);
export const getAgencies = () => api.get('/packages/agencies').then((r) => r.data);
export const getAgencyProfile = (id) => api.get(`/packages/agencies/${id}`).then((r) => r.data);

// vendor-scoped
export const getMyPackages = (params) => api.get('/vendor/packages', { params }).then((r) => r.data);
export const createPackage = (data) => api.post('/vendor/packages', data).then((r) => r.data);
export const updateMyPackage = (id, data) => api.put(`/vendor/packages/${id}`, data).then((r) => r.data);
export const deleteMyPackage = (id) => api.delete(`/vendor/packages/${id}`).then((r) => r.data);

// admin-scoped
export const adminGetPackages = (params) => api.get('/admin/packages', { params }).then((r) => r.data);
export const adminApprovePackage = (id, badge) =>
  api.put(`/admin/packages/${id}/approve`, { badge }).then((r) => r.data);
export const adminRejectPackage = (id, reason) =>
  api.put(`/admin/packages/${id}/reject`, { reason }).then((r) => r.data);
export const adminUpdatePackage = (id, data) => api.put(`/admin/packages/${id}`, data).then((r) => r.data);
export const adminDeletePackage = (id) => api.delete(`/admin/packages/${id}`).then((r) => r.data);
