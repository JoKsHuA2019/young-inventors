import Link from "next/link";
import { catalog, tracks, projectHref } from "@/lib/catalog";
import { PrintButton } from "@/components/Shared";
export const metadata = { title: "For grown-ups" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">MAKE ROOM FOR THEIR IDEAS</span>
        <h1>A place for the helpful hands.</h1>
        <p>
          You prepare the materials and help check the build. The child gets to
          ask questions, choose a test, and decide what to try next.
        </p>
      </div>
      <div className="helper-status">
        <h2>Current curriculum review state</h2>
        <p>
          All 30 lessons have complete manuscripts and interactive app editions.
          Exact-kit physical trials, Arduino-core compilation and upload, human
          accessibility review, and child pilots remain pending. Use this
          private preview to prepare and review the curriculum. No physical
          lesson has release sign-off.
        </p>
      </div>
      <div className="resource-grid">
        <article className="resource-card">
          <h3>Prepare a project</h3>
          <p>
            Every project has a grown-up view with exact quantities,
            connections, seven build steps, troubleshooting, and code where
            needed.
          </p>
          <Link href="/explore/">Choose a project →</Link>
          <a href="/originals/Young_Inventors_Helper_Guide.pdf">
            Original technical helper guide (PDF)
          </a>
          <a href="/resources/REVIEW_TEMPLATE.md" download>
            Download the physical review template
          </a>
        </article>
        <article className="resource-card">
          <h3>Make at your own pace</h3>
          <p>
            A 60-minute workshop can include time to wonder, build, experiment,
            redesign, and tidy up. A shorter session can stop at a useful
            question.
          </p>
          <a href="/resources/FACILITATION.md" download>
            Workshop schedule and support
          </a>
          <a href="/resources/RUBRIC_AND_PILOT.md" download>
            Private learning rubric and pilot guide
          </a>
          <a href="/resources/REPLACEMENT_RULES.md" download>
            Material and substitution rules
          </a>
        </article>
        <article className="resource-card">
          <h3>A notebook that stays here</h3>
          <p>
            Notes and materials use browser storage. Shared-device users may see
            them; browser cleanup may remove them. Export or print anything
            worth keeping.
          </p>
          <Link href="/notebook/">Notebook, export, and clear controls →</Link>
          <p>
            No accounts, photos, public posts, or personal information are
            needed.
          </p>
        </article>
      </div>
      <section className="editorial-content">
        <h2>Start with something approachable.</h2>
        <p>
          Begin with a checked cardboard lever (M01), an exterior-only mystery
          box (I01), or the first light circuit (C01). Teach P01 readiness
          before P03 and S01. Use C01 and C04 to prepare for the I02 repair
          activity.
        </p>
        <h3>What the pictures can tell you</h3>
        <p>
          Story illustrations show an idea and a making scene. Use the complete
          written connection table for every endpoint. Some original reference
          maps summarize only part of a circuit. Conceptual screen models do not
          establish electrical behavior, physical clearance, or safe hardware
          operation.
        </p>
        <h3>Keep the reference build specific</h3>
        <p>
          Circuit lessons use the specified isolated 3 V two-AA supply. Arduino
          lessons target Uno R3 with 5 V logic. Servo lessons require an
          adult-prepared external supply and common ground. Do not substitute
          boards or parts by appearance. Read the compatibility notes even when
          the materials list appears complete.
        </p>
        <h3>Let uncertainty be useful</h3>
        <p>
          A child can answer aloud, draw, direct a helper, or use a paper
          worksheet. A result that is inconclusive or not working yet can still
          show thoughtful engineering. Ask what the observation suggests and
          what one safe test could help next.
        </p>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE COMPLETE INVENTORY</span>
            <h2>Thirty projects, transparent status.</h2>
          </div>
          <PrintButton label="Print this inventory" />
        </div>
        <div className="review-table table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID / project</th>
                <th>Time</th>
                <th>Physical review</th>
                <th>Accessibility / pilot</th>
                <th>Release</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((l) => (
                <tr key={l.id}>
                  <td>
                    <Link href={projectHref(l.id)}>
                      {l.id.toUpperCase()} · {l.title}
                    </Link>
                  </td>
                  <td>{l.minutes} min</td>
                  <td>Not tested</td>
                  <td>Human review pending</td>
                  <td>Blocked pending review</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 style={{ marginTop: 45 }}>The original bookshelf</h2>
        <p>
          The supplied picture-book PDFs and editable slides remain the original
          edition. The app’s woodland stories are a separate revision. Print the
          app project for its current story and worksheet.
        </p>
        <div className="resource-grid">
          {tracks.map((t, i) => (
            <article className="resource-card" key={t.id}>
              <span className="eyebrow">ORIGINAL EDITION · 38 PAGES</span>
              <h3>{t.original}</h3>
              <a
                href={`/originals/${i + 1}_${t.id === "the-inventor-league" ? "inventor-league" : t.id === "inventor-league" ? "inventor-league" : t.id}.pdf`}
              >
                Read original PDF
              </a>
              <a href={`/originals/${i + 1}_${t.id}.pptx`} download>
                Download editable PowerPoint
              </a>
            </article>
          ))}
        </div>
        <a className="text-link" href="/originals/Young_Inventors_App_Copy.pdf">
          All original child pages in one PDF →
        </a>
      </section>
    </main>
  );
}
