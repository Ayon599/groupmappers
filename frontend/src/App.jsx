import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { API_BASE, fallbackImages } from './components/assetMap.js';
import HomePage from './pages/HomePage.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Activities from './pages/Activities.jsx';
import Contact from './pages/Contact.jsx';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const id = location.hash.slice(1);
    window.setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    fetch(`${API_BASE}/api/images`)
      .then((response) => response.json())
      .then((manifest) => {
        const mapped = manifest.reduce((acc, item) => {
          if (!item.localPath) return acc;
          const imageUrl = `${API_BASE}${item.localPath}`;
          if (item.key) acc[item.key] = imageUrl;
          if (item.filename) {
            acc[item.filename] = imageUrl;
            acc[item.filename.replace(/\.[^.]+$/, '')] = imageUrl;
          }
          return acc;
        }, {});
        setImages((current) => ({ ...current, ...mapped }));
      })
      .catch(() => {
        setImages(fallbackImages);
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <ScrollToHash />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage images={images} />} />
          <Route path="/about" element={<About images={images} />} />
          <Route path="/projects" element={<Projects images={images} />} />
          <Route path="/activities" element={<Activities images={images} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
