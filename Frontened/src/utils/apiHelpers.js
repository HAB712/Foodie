export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return baseUrl + imagePath;
};
