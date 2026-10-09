import { useMemo } from "react";
import { CardFace } from "@tcg/simulator-ui";
import { createFixtureState } from "../../games/riftbound/Fixtures.page";
import { officialRiftboundFixtureCards } from "../../games/riftbound/fixtures/officialFixtureCards";
import { entityFor, zoneModel } from "../../games/riftbound/RiftboundTabletop";
import Workbench, { variantEntity } from "./Workbench";
export default function RiftboundCatalog({ category }: { category: string }) {
  const state = useMemo(() => createFixtureState(officialRiftboundFixtureCards), []);
  const zones = ["p1", "p2"].flatMap((owner) =>
    (["deck", "hand", "play", "runes", "battlefields", "legend"] as const).map((zone) =>
      zoneModel(
        owner,
        zone,
        Object.values(state.cards).filter((card) => card.ownerId === owner && card.zone === zone),
      ),
    ),
  );
  const entities = Object.values(state.cards).map((card) =>
    entityFor({ ...card, face: "up" }, state),
  );
  return (
    <Workbench
      category={category}
      game="riftbound"
      source="RiftboundTabletop · entityFor · CardFace"
      boardHref="/riftbound/simulator/tests"
      entities={entities}
      zones={zones}
      supported={["rested", "hidden", "selected", "targetable", "highlighted", "damage"]}
      renderCard={(entity, knobs) => (
        <CardFace
          entity={{
            ...variantEntity(entity, knobs),
            stats: knobs.damage ? [{ label: "Might", value: String(knobs.damage) }] : entity.stats,
          }}
          density="full"
          selected={knobs.selected}
          highlighted={knobs.highlighted}
          targetable={knobs.targetable}
        />
      )}
    />
  );
}
