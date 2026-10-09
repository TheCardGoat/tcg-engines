import { useState } from "react";
import type { SimulatorEntity, SimulatorTable } from "@tcg/simulator-contract";
import LayoutFixtures from "./LayoutFixtures";
import { DragFixtures, InspectionFixtures, TargetingFixtures } from "./InputFixtures";
import MatchPanelFixtures from "./MatchPanelFixtures";
import AccessibilityFixtures from "./AccessibilityFixtures";
import classes from "./LiveFixtures.module.css";

export const libraryFamilies = [
  "Hands and layouts",
  "Inspection and choices",
  "Targeting",
  "Drag and drop",
  "Match panels",
  "Accessibility",
] as const;
export default function SharedLibraryFixtures({
  category,
  entities,
  table,
}: {
  category: string;
  entities: readonly SimulatorEntity[];
  table?: SimulatorTable;
}) {
  const [expanded, setExpanded] = useState(false);
  const [family, setFamily] = useState<string>(libraryFamilies[0]);
  const all = category === "All components";
  const active = all ? family : category;
  if (!all && !libraryFamilies.some((name) => name === category)) return null;
  return (
    <section className={classes.library} aria-label="Shared component fixtures">
      <h3>Shared building blocks with this game’s card data</h3>
      <p>
        These are live reusable components. Layout and input examples use local preview state; they
        do not change game rules.
      </p>
      {all && (
        <div className={classes.controls}>
          <button aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
            {expanded ? "Close" : "Open"} shared component fixtures
          </button>
          <label>
            Fixture family{" "}
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              {libraryFamilies.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {(!all || expanded) && (
        <div key={active}>
          {active === "Hands and layouts" && <LayoutFixtures entities={entities} />}
          {active === "Inspection and choices" && (
            <InspectionFixtures entities={entities} table={table} />
          )}
          {active === "Targeting" && <TargetingFixtures entities={entities} />}
          {active === "Drag and drop" && <DragFixtures entities={entities} />}
          {active === "Match panels" && <MatchPanelFixtures entities={entities} />}
          {active === "Accessibility" && <AccessibilityFixtures entities={entities} />}
        </div>
      )}
    </section>
  );
}
