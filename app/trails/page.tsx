import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tracks, catalog } from "@/lib/catalog";
import { StoryImage } from "@/components/Shared";
export const metadata = { title: "Project trails" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">ONE DISCOVERY LEADS TO ANOTHER</span>
        <h1>Follow a little curiosity.</h1>
        <p>
          Each trail has six things to investigate and make. Start where you
          feel curious; the grown-up guide will help you find the skills and
          preparation you need.
        </p>
      </div>
      <div className="track-grid">
        {tracks.map((t, i) => (
          <Link
            className={`track-card ${t.color}`}
            key={t.id}
            href={`/trails/${t.id}/`}
          >
            <StoryImage
              image={catalog.find((l) => l.track === t.id)!.image}
              alt={`An invention from ${t.original}`}
            />
            <div>
              <span className="eyebrow">TRAIL 0{i + 1} · 6 PROJECTS</span>
              <h2>{t.title}</h2>
              <p>{t.description}</p>
              <span className="text-link">
                Explore {t.original} <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
