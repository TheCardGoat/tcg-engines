import { useState } from "react";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "../../games/grand-archive/fixtures";
import { GrandArchiveRoleCard } from "../../games/grand-archive/GrandArchiveRoleCard";
import Workbench, { variantEntity } from "./Workbench";
import "../../games/grand-archive/grand-archive.css";
export default function GrandArchiveCatalog({ category }: { category: string }) {
  const [fixtureId, setFixtureId] = useState(
    GRAND_ARCHIVE_VISUAL_FIXTURES.find((f) => f.group === "combat")?.id ??
      GRAND_ARCHIVE_VISUAL_FIXTURES[0]!.id,
  );
  const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((f) => f.id === fixtureId)!;
  return (
    <>
      <label>
        Fixture state{" "}
        <select value={fixtureId} onChange={(event) => setFixtureId(event.target.value)}>
          {GRAND_ARCHIVE_VISUAL_FIXTURES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </label>
      <Workbench
        key={fixtureId}
        category={category}
        game="grand-archive"
        boardHref={`/grand-archive/simulator/tests/${fixture.id}`}
        source="GrandArchiveRoleCard · combat roles and counter inspector"
        entities={fixture.entities}
        zones={fixture.table.zones}
        table={fixture.table}
        supported={["rested", "hidden", "selected", "targetable", "highlighted", "damage"]}
        renderCard={(entity, knobs) => {
          const variant = variantEntity(entity, knobs);
          return (
            <GrandArchiveRoleCard
              entity={{
                ...variant,
                decorations: variant.decorations?.map((d) =>
                  d.id === "catalog-damage" ? { ...d, id: "ga:counter:damage" } : d,
                ),
              }}
              density="full"
              selected={knobs.selected}
              targetable={knobs.targetable}
              highlighted={knobs.highlighted}
              attackRole={knobs.targetable ? "candidate" : undefined}
            />
          );
        }}
      />
    </>
  );
}
