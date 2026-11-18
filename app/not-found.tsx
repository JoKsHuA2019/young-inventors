import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page-width empty-state">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>This path doesn’t lead to a project yet.</h1>
      <p>Let’s return to the workbench and find something to investigate.</p>
      <Link href="/explore/" className="button">
        Find a project
      </Link>
    </main>
  );
}
