import Link from "next/link";
export const metadata = { title: "About the workshop" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">REVERSE ENGINEERING FOUNDATION</span>
        <h1>
          There’s a story inside
          <br />
          every little machine.
        </h1>
        <p>
          Young Inventors is a free, curiosity-first workshop for ages 8–13. We
          make room for children to look closely, wonder aloud, and discover
          what their own ideas can do.
        </p>
      </div>
      <img
        className="about-art"
        src="/art/workshop-hero.webp"
        alt="The woodland friends investigate handmade inventions together."
      />
      <div className="editorial-content">
        <h2>Look inside the idea.</h2>
        <p>
          Watch a cardboard jaw move. Follow a lamp’s wire. Study a closed
          mystery box before asking to peek. Reverse engineering begins with the
          behavior we can observe and the questions it makes us ask.
        </p>
        <h2>Give the child a real decision.</h2>
        <p>
          Each project includes a prediction, a controlled experiment, and space
          to make a change. The goal is for a child to explain something they
          noticed or improved, including an idea that did not work as expected.
        </p>
        <h2>Make something worth caring about.</h2>
        <p>
          Our mouse, fox, rabbit, and squirrel bring small problems to the
          workbench: a tent needs a light, a paper creature needs a wave, a
          handle needs to feel easier to use. Children bring the questions, the
          tests, and the inventions that make those stories their own.
        </p>
        <h2>Keep the workshop welcoming.</h2>
        <p>
          Making can include drawing, speaking, writing, or directing a helper.
          There is no public ranking and no account to create. Notes stay in the
          browser, and a local show-and-tell is a complete invention day.
        </p>
        <p>
          This is a private curriculum preview. Physical review and child pilots
          remain pending. The grown-up corner explains the preparation and
          current review records.
        </p>
        <div className="button-row">
          <Link className="button" href="/explore/">
            Find something to investigate →
          </Link>
          <Link className="button secondary" href="/grownups/">
            For grown-ups
          </Link>
        </div>
      </div>
    </main>
  );
}
