import api from './axios';

export const getHeroImages = () => api.get('/settings').then((r) => r.data.heroImages);
export const adminUpdateHeroImages = (heroImages) =>
  api.put('/admin/settings/hero-images', { heroImages }).then((r) => r.data.heroImages);
