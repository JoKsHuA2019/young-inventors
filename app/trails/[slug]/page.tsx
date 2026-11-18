import { tracks, catalog } from "@/lib/catalog";
import { ProjectCard } from "@/components/Shared";
import { notFound } from "next/navigation";
import Link from "next/link";
export const generateStaticParams = () => tracks.map((t) => ({ slug: t.id }));
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = tracks.find((t) => t.id === slug);
  if (!t) notFound();
  return (
    <main id="main" className="page-width inner-page">
      <Link href="/trails/" className="back-link">
        ← All project trails
      </Link>
      <div className="page-intro">
        <span className="eyebrow">
          {t.original.toUpperCase()} · SIX LITTLE ADVENTURES
        </span>
        <h1>{t.title}</h1>
        <p>
          {t.description} Look for the earlier discoveries listed inside each
          project before preparing the build.
        </p>
      </div>
      <div className="project-grid">
        {catalog
          .filter((l) => l.track === slug)
          .map((l, i) => (
            <ProjectCard key={l.id} lesson={l} number={i + 1} />
          ))}
      </div>
    </main>
  );
}
