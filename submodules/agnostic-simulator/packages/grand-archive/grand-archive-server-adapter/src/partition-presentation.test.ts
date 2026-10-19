import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { portSmuggler, spiritOfWind, savageSlash } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

const partitionCard: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "adapter-partition",
  slug: "adapter-partition",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "adapter-partition:face",
      catalogId: "adapter-partition",
      name: "Partition test",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Reorder your deck.",
      abilities: [
        {
          id: "adapter-partition-a1",
          kind: "card-resolution",
          text: "Reorder your deck.",
          effect: {
            kind: "move-partition",
            subject: { kind: "each", collection: { zones: ["main-deck"], player: "controller" } },
            chooser: "controller",
            destinations: [
              { zone: "main-deck", placement: { kind: "top" } },
              { zone: "main-deck", placement: { kind: "bottom" } },
            ],
          },
        },
      ],
    },
  },
};

describe("Grand Archive partition candidate presentation", () => {
  it("projects native destination labels and authorized card resources only to the chooser", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWind,
        zones: { hand: [partitionCard], "main-deck": [portSmuggler, savageSlash] },
      },
      playerTwo: { id: "p2", champion: spiritOfWind },
    });
    engine.player("p1").activate(partitionCard);
    expect(engine.resolveStackUntilChoice()).toBe("decision");
    expect(engine.state.decision?.kind).toBe("resolve-move-partition");
    const server = new GrandArchiveServerEngine(
      engine.program,
      new GrandArchiveMatchRuntime(engine.program, engine.state),
    );
    const interactionView = server.getInteractionView("p1");
    const input = interactionView.actions
      .flatMap((action) => action.inputs)
      .find((input) => input.kind === "entity-partition");
    if (!input || input.kind !== "entity-partition") throw new Error("Expected partition");
    expect(input.routes.map((route) => route.text.key)).toEqual([
      "Top of main deck",
      "Bottom of main deck",
    ]);
    const ids = input.candidates.map((candidate) => candidate.entity.instanceId);
    expect(ids).toHaveLength(2);
    const resources = server.getViewerResources({ role: "player", actorId: "p1" });
    if (!("authorizedCardDefinitionIds" in resources)) throw new Error("Expected player resources");
    const direct = projectGrandArchiveSimulator(
      engine.program,
      engine.state,
      grandArchivePlayerId("p1"),
    );
    const serialized = projectGrandArchiveViewerSimulator(
      server.getViewerState({ role: "player", actorId: "p1" }),
      { ...resources, interactionView },
    );
    for (const id of ids) {
      expect(resources.authorizedCardDefinitionIds?.[id]).toBeTruthy();
      for (const projection of [direct, serialized])
        expect(projection.entities.find((entity) => entity.id === id)).toMatchObject({
          face: "public",
          dataAttributes: { "data-authorized-candidate": true },
        });
    }
    const opponentResources = server.getViewerResources({ role: "player", actorId: "p2" });
    expect(
      "authorizedCardDefinitionIds" in opponentResources &&
        opponentResources.authorizedCardDefinitionIds,
    ).toEqual({});
    const opponent = projectGrandArchiveSimulator(
      engine.program,
      engine.state,
      grandArchivePlayerId("p2"),
    );
    expect(opponent.entities.some((entity) => ids.includes(entity.id))).toBe(false);
  });
});
