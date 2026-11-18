import Explore from "@/components/Explore";
export const metadata = { title: "Things to make" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">A WORKBENCH FULL OF POSSIBILITIES</span>
        <h1>What shall we make?</h1>
        <p>
          Pick something that makes you wonder. We’ll look inside, try it
          together, and leave room for your own little twist.
        </p>
      </div>
      <Explore />
    </main>
  );
}
