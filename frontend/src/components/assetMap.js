const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  typeof window === 'undefined'
    ? 'http://localhost:5000'
    : `http://${window.location.hostname}:5000`
);

export function asset(filename) {
  return `${API_BASE}/assets/images/${filename}`;
}

export const fallbackImages = {
  logo: asset('grpmbd-1024x283.png'),
  partnerLogo: asset('group-moru-removebg-preview.png'),
  hero: asset('9d43283d-11a2-4796-8803-1eb9c7b12e83-900x640.jpg'),
  'hero-volunteer': asset('9d43283d-11a2-4796-8803-1eb9c7b12e83-900x640.jpg'),
  'who-we-are': asset('res02-img-20200221-144520-scaled.jpg'),
  whoWeAre: asset('res02-img-20200221-144520-scaled.jpg'),
  'group-photo-1': asset('323640300-873953090592227-1708312130902432154-n-900x640.jpg'),
  'group-photo-2': asset('332125939-946766212981655-4392939912334334589-n-900x640.jpg'),
  'group-photo-3': asset('img-5440-900x640.jpg'),
  'group-photo-4': asset('331983336-1200178177277688-3773989570788146855-n-900x640.jpg'),
  mission: asset('res02-img-20200221-144520-scaled.jpg'),
  'mission-community': asset('329856116-2015029008690502-4708346483387385590-n-1-900x640.jpg'),
  'volunteer-activity-1': asset('volunteer-900x640.jpg'),
  volunteer1: asset('volunteer-900x640.jpg'),
  volunteer2: asset('a2-landscape-fundraising-8-1024x724.png'),
  malariaTracker: asset('caddddpture-1024x420.jpg'),
  covidMask: asset('mask-status-by-location-1024x424.jpg'),
  rabies: asset('rabies.jpg'),
  fundraising: asset('a2-landscape-fundraising-8-1024x724.png'),
  showcase: asset('18-groupmappers-showcase-1024x576.jpg'),
  richard: asset('richard.jpg'),
  sinha: asset('sinha.jpg'),
  sazid: asset('sazid-ibna-zaman-879x1024.jpg')
};

export { API_BASE };
