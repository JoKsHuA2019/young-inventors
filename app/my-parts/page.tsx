import Materials from "@/components/Materials";
export const metadata = { title: "My materials" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">A PLACE FOR YOUR SUPPLIES</span>
        <h1>My making box</h1>
        <p>
          Add the things you have, then see what you could make. A few scraps of
          cardboard are a lovely place to start.
        </p>
      </div>
      <Materials />
    </main>
  );
}
