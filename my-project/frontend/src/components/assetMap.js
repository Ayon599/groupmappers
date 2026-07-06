const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function asset(filename) {
  return `${API_BASE}/assets/images/${filename}`;
}

export const fallbackImages = {
  logo: asset('main-logo.png'),
  hero: asset('hero-volunteer.jpg'),
  'hero-volunteer': asset('hero-volunteer.jpg'),
  whoWeAre: asset('who-we-are.jpg'),
  'who-we-are': asset('who-we-are.jpg'),
  mission: asset('mission.jpg'),
  volunteer1: asset('volunteer1.jpg'),
  volunteer2: asset('volunteer2.jpg')
};

export { API_BASE };
