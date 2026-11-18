"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  ArrowRight,
  Leaf,
  Menu,
  X,
  BookOpen,
  Scissors,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import type { CatalogLesson, ImageRef } from "@/lib/types";
import { trackFor, projectHref } from "@/lib/catalog";
import { useWorkshop } from "./WorkshopProvider";
import { assetPath } from "@/lib/assets";
export function StoryImage({
  image,
  alt,
  className = "",
}: {
  image: ImageRef;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`story-image ${className}`}>
      {failed ? (
        <p className="image-fallback">
          {alt}. The picture couldn’t open, but you can follow the story below.
        </p>
      ) : (
        <img
          ref={(node) => {
            // A cached failure can happen before React attaches onError.
            if (node?.complete && node.naturalWidth === 0) setFailed(true);
          }}
          src={assetPath(image.path)}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{
            width: `${image.columns * 100}%`,
            maxWidth: "none",
            left: `-${(image.cell % image.columns) * 100}%`,
            top: `-${Math.floor(image.cell / image.columns) * 100}%`,
            height: `${image.rows * 100}%`,
          }}
        />
      )}
    </div>
  );
}
export function Nav() {
  const { ready } = useWorkshop();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const more = useRef<HTMLDivElement>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const closeNavigation = () => {
    setOpen(false);
    setMoreOpen(false);
  };
  useEffect(() => {
    if (!open && !moreOpen) return;
    const dismissOutside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!more.current?.contains(event.target)) setMoreOpen(false);
      if (!header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [open, moreOpen]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to the workshop
      </a>
      <header
        className="site-header"
        ref={header}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            closeNavigation();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          if (moreOpen) {
            setMoreOpen(false);
            moreButton.current?.focus();
          } else if (open) {
            setOpen(false);
            mobileButton.current?.focus();
          } else return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <Link
          href="/"
          className="brand"
          aria-label="Young Inventors home"
          onClick={closeNavigation}
        >
          <span className="brand-mark">
            <Lightbulb size={25} />
            <Leaf size={12} />
          </span>
          <span>
            young inventors
            <span className="brand-small">THE WOODLAND WORKSHOP</span>
          </span>
        </Link>
        <button
          className="mobile-toggle"
          ref={mobileButton}
          disabled={!ready}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => {
            setOpen(!open);
            setMoreOpen(false);
          }}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "nav open" : "nav"}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a"))
              closeNavigation();
          }}
        >
          <Link href="/explore/">Things to make</Link>
          <Link href="/trails/">Project trails</Link>
          <Link href="/my-parts/">My materials</Link>
          <Link href="/notebook/" className="notebook-link">
            <BookOpen size={18} /> My notebook
          </Link>
          <div
            className="nav-more"
            ref={more}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setMoreOpen(false);
            }}
          >
            <button
              className="nav-more-toggle"
              ref={moreButton}
              type="button"
              disabled={!ready}
              aria-expanded={moreOpen}
              aria-controls="more-navigation"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More <ChevronDown size={15} aria-hidden="true" />
            </button>
            <div
              id="more-navigation"
              className="nav-more-panel"
              hidden={!moreOpen}
            >
              <Link href="/gallery/">
                <BookOpen size={17} aria-hidden="true" /> Invention stories
              </Link>
              <Link href="/about/">
                <Leaf size={17} aria-hidden="true" /> About the workshop
              </Link>
              <Link href="/grownups/">
                <Lightbulb size={17} aria-hidden="true" /> Grown-up guide
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link href="/" className="footer-brand">
          <Leaf size={22} /> A little curiosity goes a long way.
        </Link>
        <p>A project by Reverse Engineering Foundation · 2026</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/gallery/">Invention stories</Link>
        <Link href="/about/">About the workshop</Link>
        <Link href="/grownups/">Grown-up guide</Link>
      </nav>
      <p className="fine">
        A curriculum preview. Physical activities await exact-kit review.
        <br />
        Your notebook stays in this browser. No account needed.
      </p>
    </footer>
  );
}
export function ProjectCard({
  lesson,
  number,
}: {
  lesson: CatalogLesson;
  number?: number;
}) {
  const t = trackFor(lesson.track);
  return (
    <Link className={`project-card ${t.color}`} href={projectHref(lesson.id)}>
      <div className="card-picture">
        <StoryImage image={lesson.image} alt={lesson.title} />
        <span className="card-label">
          {lesson.board === "none" ? (
            <Scissors size={14} />
          ) : (
            <Lightbulb size={14} />
          )}{" "}
          {lesson.board === "none"
            ? "Paper & possibility"
            : lesson.board === "3V_2xAA"
              ? "A little electricity"
              : "Code & curiosity"}
        </span>
        {number !== undefined && <span className="card-number">0{number}</span>}
      </div>
      <div className="card-copy">
        <span className="eyebrow">{t.original}</span>
        <h3>{lesson.title}</h3>
        <p>{lesson.intro.split(". ")[0]}.</p>
        <div className="card-bottom">
          <span>
            <Clock size={15} /> {lesson.minutes} minutes · with a helper
          </span>
          <span className="round-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </div>
    </Link>
  );
}
export function ContinueProject() {
  const { state } = useWorkshop();
  const latest = Object.entries(state.progress).sort((a, b) =>
    b[1].updated.localeCompare(a[1].updated),
  )[0];
  return latest ? (
    <Link className="continue-note" href={projectHref(latest[0])}>
      <BookOpen size={19} /> Your workbench is just where you left it.{" "}
      <span>
        Continue making <ArrowRight size={16} />
      </span>
    </Link>
  ) : null;
}
export function PrintButton({
  label = "Print this project",
}: {
  label?: string;
}) {
  return (
    <button className="button secondary" onClick={() => window.print()}>
      {label}
    </button>
  );
}
