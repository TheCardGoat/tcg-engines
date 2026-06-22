import { describe, expect, it } from "vitest";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";

import { DEFAULT_SCENARIO, getScenario, P1, P2 } from "./fixtures/scenarios.js";
import {
  cyberpunkCardZoneToSimulatorZone,
  projectEntityForCard,
  projectSimulator,
  projectToHarnessFixture,
  type Side,
} from "./projectSimulator.js";

function buildOpeningFixture() {
  const engine = getScenario(DEFAULT_SCENARIO).build();
  const matchState = engine.getState();
  const interactionViews = {
    player: buildCyberpunkInteractionView({
      actorId: "player",
      stateVersion: matchState.ctx.stateID,
      prompt: engine.getPrompt(P1),
    }),
    opponent: buildCyberpunkInteractionView({
      actorId: "opponent",
      stateVersion: matchState.ctx.stateID,
      prompt: engine.getPrompt(P2),
    }),
  } as const;
  return { matchState, interactionViews };
}

describe("projectSimulator", () => {
  it("projects the opening scenario into a shared fixture", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    expect(projection.table.seats).toHaveLength(2);
    expect(projection.table.zones.length).toBeGreaterThan(0);
    expect(projection.entities.length).toBeGreaterThan(0);
    expect(projection.boardLayout.sections.length).toBeGreaterThan(0);
  });

  it("produces a harness fixture with required metadata", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const fixture = projectToHarnessFixture({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    expect(fixture.gameSlug).toBe("cyberpunk");
    expect(fixture.table).toBeDefined();
    expect(fixture.entities).toBeDefined();
    expect(fixture.interactions).toBeDefined();
    expect(fixture.boardLayout).toBeDefined();
  });

  it("resolves a card entity from the engine card index", () => {
    const { matchState } = buildOpeningFixture();
    const firstCardId = Object.keys(matchState.G.cardIndex)[0];
    expect(firstCardId).toBeDefined();

    const entity = projectEntityForCard(firstCardId!, matchState, "player" as Side);
    expect(entity).not.toBeNull();
    expect(entity?.id).toBe(firstCardId);
    expect(entity?.kind).toMatch(/^(card|unit|leader)$/);
  });

  it("projects active seat from turn metadata", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    expect(projection.table.seats.map((s) => s.id)).toContain(projection.table.status.activeSeatId);
  });

  it("renders opponent private zones with hidden-backed entities for the viewer", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    const entityMap = new Map(projection.entities.map((e) => [e.id, e]));
    for (const zoneId of ["opp-hand", "opp-legendArea", "opp-eddieArea"]) {
      const zone = projection.table.zones.find((candidate) => candidate.id === zoneId);
      expect(zone?.visibility).toBe("private");
      expect(zone?.count).toBeGreaterThanOrEqual(0);
      // Hand and legend zone counts map directly to cards; eddies count is currency.
      if (zoneId !== "opp-eddieArea" && (zone?.count ?? 0) > 0) {
        expect(zone?.entityIds.length).toBeGreaterThan(0);
      }
      for (const entityId of zone?.entityIds ?? []) {
        const entity = entityMap.get(entityId);
        expect(entity).toBeDefined();
        // Hand and eddie cards are always hidden from the viewer.
        if (zoneId === "opp-hand" || zoneId === "opp-eddieArea") {
          expect(entity?.face).toBe("hidden");
        }
      }
    }
  });

  it("links stack and gig layout blocks to projected zones", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    const blocks = projection.boardLayout.sections.flatMap((section) => section.blocks);
    for (const blockId of ["opp-deck", "opp-trash", "p-deck", "p-trash", "p-gig-dice"]) {
      const block = blocks.find((candidate) => candidate.id === blockId);
      expect(block?.zoneId).toBeDefined();
      expect(block?.value).toBeUndefined();
    }
  });

  it("uses player ids consistently for seats and zone ownership", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews,
      humanSide: "player" as Side,
    });

    expect(projection.table.seats.map((seat) => seat.id).sort()).toEqual([P1, P2].sort());
    expect(projection.table.zones.find((zone) => zone.id === "p-hand")?.ownerId).toBe(P1);
  });

  it("keeps animation zone descriptors aligned with projected zone roles", () => {
    expect(cyberpunkCardZoneToSimulatorZone("legendArea", "player").role).toBe("leader");
    expect(cyberpunkCardZoneToSimulatorZone("gigArea", "player").role).toBe("score");
  });

  it("omits multi-required-input actions the shared interaction model cannot submit", () => {
    const { matchState, interactionViews } = buildOpeningFixture();
    const multiInputView: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: P1,
      stateVersion: matchState.ctx.stateID,
      status: "ready",
      actions: [
        {
          id: "customMultiInput",
          requestId: "request-1",
          intent: "custom",
          text: { key: "Custom" },
          enabled: true,
          inputs: [
            {
              id: "first",
              kind: "entity-selection",
              entityKinds: ["card"],
              role: "source",
              text: { key: "First" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                { entity: { kind: "card", instanceId: "first", ownerId: P1 }, enabled: true },
              ],
            },
            {
              id: "second",
              kind: "entity-selection",
              entityKinds: ["card"],
              role: "target",
              text: { key: "Second" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                { entity: { kind: "card", instanceId: "second", ownerId: P2 }, enabled: true },
              ],
            },
          ],
        },
      ],
    };

    const projection = projectSimulator({
      matchState,
      viewerSide: "player" as Side,
      interactionViews: { ...interactionViews, player: multiInputView },
      humanSide: "player" as Side,
    });

    expect(projection.interactions).toHaveLength(0);
  });
});
