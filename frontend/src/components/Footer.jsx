import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';

const social = [
  ['Facebook', Facebook],
  ['Twitter', Twitter],
  ['Instagram', Instagram],
  ['LinkedIn', Linkedin],
  ['YouTube', Youtube]
];

export default function Footer() {
  return (
    <footer id="contact-us" className="bg-[#07182c] py-16 text-white">
      <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <h2 className="text-2xl font-black">GroupMappers</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            A crowdsourcing geospatial initiative working to improve public health outcomes through mapping, data analysis, volunteer action, and community support.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map(([label, Icon]) => (
              <a key={label} href="#" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-gm-sky hover:text-gm-sky">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gm-sky">Contact Us</h3>
          <div className="mt-5 space-y-4 text-sm text-white/70">
            <p className="flex gap-3"><Phone size={18} className="text-gm-sky" /> +8801793593083</p>
            <p className="flex gap-3"><Mail size={18} className="text-gm-sky" /> groupmappers@gmail.com</p>
            <p className="flex gap-3"><MapPin size={18} className="text-gm-sky" /> House: 6/20 (1st floor), Block-E, Lalmatia, Mohammadpur, Dhaka, Bangladesh.</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gm-sky">Important Links</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/70">
            {['Home', 'Who we are', 'What We Do', 'Latest News', 'Projects', 'Activities'].map((link) => (
              <a key={link} href="#" className="transition hover:text-white">{link}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="section-shell mt-12 border-t border-white/10 pt-6 text-sm text-white/45">
        © 2026 Copyright | GroupMappers | All rights reserved.
      </div>
    </footer>
  );
}
