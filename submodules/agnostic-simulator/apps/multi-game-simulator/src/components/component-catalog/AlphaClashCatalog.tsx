/** The catalog uses the same interactive R3F fixture as the simulator. */
export default function AlphaClashCatalog({ category }: { category: string }) {
  return (
    <section aria-label={`Alpha Clash ${category}`}>
      <p>
        Cards, zones, selection, and controls use the React Three Fiber arena.{" "}
        <a href="/alpha-clash/simulator/tests/arena">Open the interactive board fixture</a>
      </p>
      <iframe
        title="Alpha Clash React Three Fiber board"
        src="/alpha-clash/simulator/tests/arena"
        style={{ width: "100%", height: "75vh", minHeight: 480, border: 0 }}
      />
    </section>
  );
}
