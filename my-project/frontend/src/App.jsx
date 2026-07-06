import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { API_BASE, fallbackImages } from './components/assetMap.js';
import HomePage from './pages/HomePage.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Activities from './pages/Activities.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    fetch(`${API_BASE}/api/images`)
      .then((response) => response.json())
      .then((manifest) => {
        const mapped = manifest.reduce((acc, item) => {
          acc[item.key] = `${API_BASE}${item.localPath}`;
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
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage images={images} />} />
          <Route path="/about" element={<About images={images} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/activities" element={<Activities images={images} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
