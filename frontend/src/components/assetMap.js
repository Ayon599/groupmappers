const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function asset(filename) {
  return `${API_BASE}/assets/images/${filename}`;
}

export const fallbackImages = {
  logo: asset('main-logo.png'),
  hero: asset('hero-volunteer.jpg'),
  'hero-volunteer': asset('hero-volunteer.jpg'),
  'who-we-are': asset('who-we-are.jpg'),
  whoWeAre: asset('who-we-are.jpg'),
  'group-photo-1': asset('group-photo-1.jpg'),
  'group-photo-2': asset('group-photo-2.jpg'),
  'group-photo-3': asset('group-photo-3.jpg'),
  'group-photo-4': asset('group-photo-4.jpg'),
  mission: asset('group-photo-3.jpg'),
  'mission-community': asset('group-photo-2.jpg'),
  'volunteer-activity-1': asset('volunteer-activity-1.jpg'),
  volunteer1: asset('volunteer-activity-1.jpg'),
  volunteer2: asset('group-photo-4.jpg')
};

export { API_BASE };
