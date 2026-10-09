import { useMemo, useState } from "react";
import { FAB_VISUAL_FIXTURES } from "../../games/flesh-and-blood/fixtures";
import {
  entityForFabPresentationCard,
  metadataForFabPresentationCard,
} from "../../games/flesh-and-blood/projection";
import {
  FabBoardCardFace,
  FabBoardHighlightProvider,
} from "../../games/flesh-and-blood/FabBoardCardFace";
import { FabPresentationCatalogProvider } from "../../games/flesh-and-blood/FabPresentationCatalog";
import { createFabClock } from "@tcg/flesh-and-blood-server-adapter/clock";
import { FabMatchClock } from "../../games/flesh-and-blood/FabMatchClock";
import type { SimulatorZone, SimulatorTable } from "@tcg/simulator-contract";
import { FabCardPreviewProvider } from "../../games/flesh-and-blood/FabCardPreview";
import { useFabCardPresentation } from "../../games/flesh-and-blood/useFabCardPresentation";
import { fixturePresentationDefinitions } from "../../games/flesh-and-blood/fixture-presentation";
import Workbench, { Specimen, variantEntity } from "./Workbench";
import "../../games/flesh-and-blood/flesh-and-blood.css";
function Contents({ category }: { category: string }) {
  const [fixtureId, setFixtureId] = useState(
    FAB_VISUAL_FIXTURES.find((f) => f.group === "combat")?.id ?? FAB_VISUAL_FIXTURES[0]!.id,
  );
  const fixture = FAB_VISUAL_FIXTURES.find((f) => f.id === fixtureId)!;
  const state = useMemo(() => fixture.create(), [fixture]);
  const definitions = useMemo(
    () =>
      fixturePresentationDefinitions(
        Object.entries(state.cardDefinitions).map(([id, definition]) => ({
          canonicalId: definition.presentationCanonicalId ?? id,
          slug: definition.slug,
          name: definition.presentationName ?? definition.name,
        })),
      ),
    [state],
  );
  useFabCardPresentation(definitions, fixtureId);
  const entities = Object.values(state.cards).map((card) =>
    entityForFabPresentationCard(
      card,
      metadataForFabPresentationCard(card, state.cardDefinitions[card.cardId]),
      { kind: "viewer", viewerId: fixture.scenario.viewerId },
    ),
  );
  const zones: SimulatorZone[] = state.players.flatMap((owner) =>
    [
      ...new Set(
        Object.values(state.cards)
          .filter((card) => card.ownerId === owner)
          .map((card) => card.zone),
      ),
    ].map((zone) => ({
      id: `${owner}:${zone}`,
      label: zone,
      hint: "Fixture card zone",
      ownerId: owner,
      role:
        zone === "deck"
          ? "deck"
          : zone === "graveyard"
            ? "discard"
            : zone === "hand"
              ? "hand"
              : "battlefield",
      visibility: zone === "deck" ? "secret" : "public",
      layoutHint: zone === "deck" ? "stack" : "row",
      entityIds: Object.values(state.cards)
        .filter((card) => card.ownerId === owner && card.zone === zone)
        .map((card) => card.id),
    })),
  );
  const table: SimulatorTable = {
    zones,
    status: {
      phase: state.phase,
      turn: state.turnNumber,
      stateVersion: 0,
      activeSeatId: state.activePlayerId ?? "",
    },
    seats: state.players.map((id) => ({
      id,
      label: id === fixture.scenario.viewerId ? "You" : "Rival",
      role: "human",
      perspective: id === fixture.scenario.viewerId ? "bottom" : "top",
      counters: [
        { label: "Life", value: String(state.life[id]) },
        { label: "Resources", value: String(state.resourcePoints[id]) },
        { label: "Action points", value: String(state.actionPoints[id]) },
      ],
    })),
  };
  const clock = useMemo(
    () =>
      createFabClock(
        { mode: "dynamic", initialReserveMs: 180000, extras: { graceMs: 15000 } },
        ["p1", "p2"],
        "p1",
        0,
      ),
    [],
  );
  return (
    <>
      <label>
        Fixture state{" "}
        <select value={fixtureId} onChange={(event) => setFixtureId(event.target.value)}>
          {FAB_VISUAL_FIXTURES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <Workbench
        key={fixtureId}
        category={category}
        game="flesh-and-blood"
        source="FabBoardCardFace · fixture presentation registry"
        boardHref={`/flesh-and-blood/simulator/tests/${fixtureId}`}
        entities={entities}
        visualRenderer={FabBoardCardFace}
        zones={zones}
        table={table}
        controlPreview={
          <Specimen title="Match clock states" source="FabMatchClock">
            <FabMatchClock clock={clock} playerId="p1" label="Active clock" now={0} />
            <FabMatchClock clock={clock} playerId="p1" label="Warning clock" now={175000} />
            <FabMatchClock clock={clock} playerId="p1" label="Expired clock" now={300000} />
          </Specimen>
        }
        supported={["rested", "hidden", "highlighted", "damage"]}
        renderCard={(entity, knobs) => {
          const variant = variantEntity(entity, knobs);
          return (
            <FabBoardHighlightProvider entityIds={knobs.highlighted ? [entity.id] : []}>
              <FabBoardCardFace
                entity={{
                  ...variant,
                  decorations: variant.decorations?.map((d) =>
                    d.id === "catalog-damage"
                      ? { ...d, id: "fab-counter-power", ariaLabel: "Power counter" }
                      : d,
                  ),
                }}
                density="full"
              />
            </FabBoardHighlightProvider>
          );
        }}
      />
    </>
  );
}
export default function FabCatalog(props: { category: string }) {
  return (
    <FabPresentationCatalogProvider>
      <FabCardPreviewProvider>
        <Contents {...props} />
      </FabCardPreviewProvider>
    </FabPresentationCatalogProvider>
  );
}
