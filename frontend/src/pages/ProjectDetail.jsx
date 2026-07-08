import { Link, useParams } from 'react-router-dom';
import { projects } from '../data/siteContent.js';

export default function ProjectDetail({ images }) {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return (
      <main className="bg-slate-50 py-20 lg:py-28">
        <div className="section-shell">
          <p className="eyebrow">Project</p>
          <h1 className="mt-4 text-5xl font-black text-gm-navy">Project not found</h1>
          <Link to="/projects" className="mt-8 inline-flex rounded-full bg-gm-navy px-6 py-3 text-sm font-black text-white">
            Back to projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="section-shell grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-[-0.05em] text-gm-navy">
            {project.title}
          </h1>
          <p className="mt-4 text-sm font-black text-gm-sky">{project.year}</p>
          <p className="mt-6 text-lg leading-8 text-slate-600">{project.summary}</p>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The work follows GroupMappers core operating model: data collection and management, data analysis and modeling, mapping and visualization, and data dissemination and sharing for public-health decision support.
          </p>
          <Link to="/projects" className="mt-8 inline-flex rounded-full bg-gm-green px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-500/20">
            Back to all projects
          </Link>
        </div>
        <img
          src={images[project.imageKey] || images.hero}
          alt={project.title}
          className="h-[520px] w-full rounded-[2rem] object-cover shadow-soft"
        />
      </section>
    </main>
  );
}
