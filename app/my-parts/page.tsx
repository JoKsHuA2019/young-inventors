import Materials from "@/components/Materials";
export const metadata = { title: "My materials" };
export default function Page() {
  return (
    <main id="main" className="page-width inner-page">
      <div className="page-intro">
        <span className="eyebrow">WHAT’S IN YOUR MAKING BOX?</span>
        <h1>Small things. So many possibilities.</h1>
        <p>
          A piece of cardboard can become a jaw, a handle, or the start of a
          mystery. Let’s see what your materials might make.
        </p>
      </div>
      <Materials />
    </main>
  );
}
