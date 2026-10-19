import { AlphaClashCounterIconsPreview } from "./AlphaClashCounterIconsPreview";
import { AlphaClashZoneOverflowPreview } from "./AlphaClashZoneOverflowPreview";
import { AlphaClashIndicatorsPreview } from "./AlphaClashIndicatorsPreview";
import { AlphaClashTurnHudPreview } from "./AlphaClashTurnHudPreview";

/** HUD candidates are isolated from the live native-engine board. */
export default function AlphaClashCatalog({ category }: { category: string }) {
  return (
    <section aria-label={`Alpha Clash ${category}`}>
      {["All components", "Counters", "Zones"].includes(category) && (
        <AlphaClashCounterIconsPreview />
      )}
      {["All components", "Zones"].includes(category) && <AlphaClashZoneOverflowPreview />}
      {["All components", "Controls", "Counters", "Zones"].includes(category) && (
        <AlphaClashIndicatorsPreview />
      )}
      {(category === "All components" || category === "Controls") && <AlphaClashTurnHudPreview />}
      {category !== "Controls" && (
        <>
          <p>
            Cards, zones, selection, and controls use the React Three Fiber arena.{" "}
            <a href="/alpha-clash/simulator/tests/arena">Open the interactive board fixture</a>
          </p>
          <iframe
            title="Alpha Clash React Three Fiber board"
            src="/alpha-clash/simulator/tests/arena"
            style={{ width: "100%", height: "75vh", minHeight: 480, border: 0 }}
          />
        </>
      )}
    </section>
  );
}
