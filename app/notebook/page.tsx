import Notebook from "@/components/Notebook";
export const metadata = { title: "My notebook" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">A PLACE FOR YOUR WHAT-IFS</span>
        <h1>My invention notebook</h1>
        <p>
          Keep the things you noticed, the ideas you changed, and the questions
          that followed you home.
        </p>
      </div>
      <Notebook />
    </main>
  );
}
