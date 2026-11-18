import Link from "next/link";
import { byId, projectHref } from "@/lib/catalog";
import { StoryImage } from "@/components/Shared";
const stories = [
  {
    id: "c01",
    title: "A reading room after sunset",
    problem:
      "A pretend camper needs a lamp that stays lit inside a cardboard tent.",
    experiment:
      "Compare the closed circuit with one return connection opened, disconnecting power for each change.",
    redesign:
      "Add a paper support that keeps the wire from being pulled when the tent is moved.",
  },
  {
    id: "m01",
    title: "A creature with a longer tail",
    problem:
      "A cardboard jaw needs to lift the same tiny paper load from two push spots.",
    experiment:
      "Keep the pivot and load in place, and compare the near and far effort points.",
    redesign:
      "Choose a longer tail and leave more room for the hand to travel.",
  },
  {
    id: "p03",
    title: "A doorbell for a gentle paw",
    problem: "A small button is awkward to press through a cardboard doorway.",
    experiment:
      "Try five press-and-release cycles with a larger paper flap over the button.",
    redesign:
      "Change the flap’s shape so it presses without bending the button’s legs.",
  },
  {
    id: "s01",
    title: "A cloud with a clearer shadow",
    problem:
      "A light sensor gives overlapping readings as a paper cloud passes.",
    experiment:
      "Compare repeated groups of readings with the same lamp and card positions.",
    redesign:
      "Add a paper hood and investigate whether the light and shade groups become easier to distinguish.",
  },
  {
    id: "i02",
    title: "One wire, one useful clue",
    problem:
      "An adult-prepared lamp is dark, but darkness alone does not reveal the fault.",
    experiment:
      "Inspect the return lead and predict what restoring only that connection would do.",
    redesign:
      "Make a repair card that reminds the next investigator to change one thing at a time.",
  },
  {
    id: "i04",
    title: "Two handles, two possibilities",
    problem: "A paper flap needs a comfortable way to open without tearing.",
    experiment:
      "Invite a partner to compare a wide tab and a loop using the same gentle opening task.",
    redesign:
      "Use the partner’s feedback to change one handle, then repeat the comparison.",
  },
];
export const metadata = { title: "Invention stories" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">IDEAS AROUND THE WORKBENCH</span>
        <h1>Every change has a story.</h1>
        <p>
          A wobble, a loose wire, a different kind of handle. These little
          things can lead to an invention worth investigating.
        </p>
      </div>
      <div className="paper-note">
        <p>
          These are illustrated example stories written for the workshop. They
          are not reports of tested builds or submissions from children. Your
          own invention can stay on your table and in your private notebook.
        </p>
      </div>
      <div className="gallery-grid">
        {stories.map((s) => (
          <article className="gallery-story" key={s.id}>
            <StoryImage
              image={byId(s.id).image}
              alt={`Illustration for ${s.title}`}
            />
            <div className="gallery-copy">
              <span className="eyebrow">AN ILLUSTRATIVE INVENTION STORY</span>
              <h2>{s.title}</h2>
              <h3>THE PROBLEM</h3>
              <p>{s.problem}</p>
              <h3>AN EXPERIMENT TO TRY</h3>
              <p>{s.experiment}</p>
              <h3>A POSSIBLE REDESIGN</h3>
              <p>{s.redesign}</p>
              <Link className="text-link" href={projectHref(s.id)}>
                Investigate this idea →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
