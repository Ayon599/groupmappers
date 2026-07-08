import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, HeartHandshake, Menu, X } from 'lucide-react';
import { fallbackImages } from './assetMap.js';
import { aboutMenuItems, activityMenuItems, projectGroups, slugify } from '../data/siteContent.js';

const projectItems = projectGroups.flatMap((group) => [
  { label: group.group, to: '/projects', heading: true },
  ...group.items.map(([title]) => ({ label: title, to: `/projects/${slugify(title)}` }))
]);

function activeClass({ isActive }) {
  return `text-sm font-bold transition ${isActive ? 'text-gm-sky' : 'text-slate-600 hover:text-gm-sky'}`;
}

function Dropdown({ label, items, openMenu, setOpenMenu }) {
  const closeTimer = useRef(null);
  const isOpen = openMenu === label;

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openDropdown() {
    clearCloseTimer();
    setOpenMenu(label);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpenMenu((current) => (current === label ? null : current));
    }, 240);
  }

  function toggleDropdown() {
    clearCloseTimer();
    setOpenMenu(isOpen ? null : label);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleClose}
      onFocus={openDropdown}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 transition hover:text-gm-sky"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute left-0 top-full z-50 w-80 pt-3 transition-all duration-200 ${
          isOpen
            ? 'block translate-y-0 opacity-100 pointer-events-auto'
            : 'hidden -translate-y-2 opacity-0 pointer-events-none'
        }`}
        onMouseEnter={openDropdown}
        onMouseLeave={scheduleClose}
        role="menu"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
          {items.map((item) => (
            item.heading ? (
              <p key={item.label} className="px-4 pb-1 pt-3 text-[11px] font-black uppercase tracking-[0.18em] text-gm-sky">
                {item.label}
              </p>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpenMenu(null)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-gm-sky"
                role="menuitem"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-xl">
      <nav className="section-shell flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={fallbackImages.logo} alt="GroupMappers" className="h-12 w-28 object-contain" />
          <span>
            <strong className="block text-lg font-black leading-none text-gm-navy">GroupMappers</strong>
            <small className="text-xs font-bold text-gm-sky">Crowdsourced geospatial public health</small>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" className={activeClass}>Home</NavLink>
          <Dropdown label="About Us" items={aboutMenuItems} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <Dropdown label="Project" items={projectItems} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <Dropdown label="Activities" items={activityMenuItems} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          <NavLink to="/contact" className={activeClass}>Contact Us</NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/donate-us" className="hidden items-center gap-2 rounded-full bg-gm-green px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 sm:flex">
            <HeartHandshake size={17} />
            Donate Us
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-gm-navy lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`${mobileOpen ? 'block' : 'hidden'} border-t border-slate-100 bg-white lg:hidden`}>
        <div className="section-shell grid gap-2 py-4">
          {[
            ['Home', '/'],
            ['About Us', '/about'],
            ['Projects', '/projects'],
            ['Activities', '/activities'],
            ['Team Members', '/team-members'],
            ['Gallery', '/gallery'],
            ['Latest News', '/latest-news'],
            ['Contact Us', '/contact'],
            ['Donate Us', '/donate-us']
          ].map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-sky-50 hover:text-gm-sky"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
