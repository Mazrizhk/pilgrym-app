import api from './axios';

export const createBooking = (data) => api.post('/bookings', data).then((r) => r.data);
export const getMyBookings = () => api.get('/bookings/my').then((r) => r.data);
export const cancelMyBooking = (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data);

// vendor-scoped
export const getVendorBookings = () => api.get('/vendor/bookings').then((r) => r.data);
export const updateVendorBooking = (id, status) =>
  api.put(`/vendor/bookings/${id}`, { status }).then((r) => r.data);

// admin-scoped
export const adminGetBookings = () => api.get('/admin/bookings').then((r) => r.data);
