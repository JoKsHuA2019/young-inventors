import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Scissors,
  Lightbulb,
  Search,
} from "lucide-react";
import { ProjectCard, ContinueProject } from "@/components/Shared";
import { byId, tracks } from "@/lib/catalog";
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span /> THE WORKSHOP IS OPEN
          </span>
          <h1>
            What shall we
            <br />
            make <em>today?</em>
          </h1>
          <p>
            A cardboard creature that waves hello. A tiny tent that needs a
            light. A mysterious box waiting to be figured out.
          </p>
          <p className="hero-invitation">
            Come in. There’s something here for your curiosity.
          </p>
          <Link href="/explore/" className="button hero-button">
            Find something to make <ArrowRight size={19} />
          </Link>
          <div className="hero-footnote">
            <span>
              <Scissors size={16} /> Everyday materials
            </span>
            <span>
              <Leaf size={16} /> Big little discoveries
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src={assetPath("art/workshop-hero.webp")}
            alt="Fox, Mouse, Rabbit, and Squirrel gather around a handmade tent lamp and a cardboard jaw in their sunny woodland workshop."
            fetchPriority="high"
          />
          <div className="hero-sticker">
            <span className="sticker-star">✳</span>
            <span>
              Made for
              <br />
              <strong>curious minds.</strong>
            </span>
          </div>
          <div className="hero-caption">
            A little making. A little wondering. A lot to discover.
          </div>
        </div>
      </section>
      <div className="workshop-strip">
        <span>
          <Scissors size={19} /> Make it with your hands
        </span>
        <span>
          <Search size={19} /> Find out how it works
        </span>
        <span>
          <Lightbulb size={19} /> Try an idea of your own
        </span>
      </div>
      <div className="page-width">
        <ContinueProject />
        <section className="featured-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PULL UP A CHAIR</span>
              <h2>Where shall we begin?</h2>
              <p>Three little adventures. Plenty of room for your own ideas.</p>
            </div>
            <Link href="/explore/" className="text-link">
              All things to make <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="project-grid">
            {["m01", "c01", "i01"].map((id, i) => (
              <ProjectCard key={id} lesson={byId(id)} number={i + 1} />
            ))}
          </div>
        </section>
        <section className="workshop-invitation">
          <div className="friends-image">
            <img
              src={assetPath("art/workshop-friends.webp")}
              alt="Our four workshop friends: Fox, Mouse, Rabbit, and Squirrel."
              loading="lazy"
            />
          </div>
          <div>
            <span className="eyebrow">YOU BRING THE WHAT-IF</span>
            <h2>
              Every invention starts
              <br />
              with a little wondering.
            </h2>
            <p>
              Our friends have ideas, but they don’t have all the answers. Take
              a closer look with them. Try a change, follow a clue, and see what
              your hands can figure out.
            </p>
            <Link href="/trails/" className="text-link">
              Follow a project trail <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        <section className="trails-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
              <h2>There’s a whole workshop to explore.</h2>
            </div>
          </div>
          <div className="trail-list">
            {tracks.map((t, i) => (
              <Link
                className={`trail-row ${t.color}`}
                key={t.id}
                href={`/trails/${t.id}/`}
              >
                <span className="trail-symbol">{t.symbol}</span>
                <div>
                  <span className="eyebrow">TRAIL 0{i + 1} · 6 PROJECTS</span>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </section>
        <section className="grownup-banner">
          <div>
            <span className="eyebrow">A NOTE FOR GROWN-UPS</span>
            <h2>
              A little preparation.
              <br />
              Room for a lot of discovery.
            </h2>
            <p>
              Find the materials, exact build instructions, and review notes for
              making together. The child gets to wonder. You help make space to
              try.
            </p>
          </div>
          <Link href="/grownups/" className="button secondary">
            Visit the grown-up corner <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
import { assetPath } from "@/lib/assets";
