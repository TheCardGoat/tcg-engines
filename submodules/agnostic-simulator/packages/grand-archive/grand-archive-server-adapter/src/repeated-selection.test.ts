import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { spiritOfWind, swordOfAdversity } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveSelectionCount,
} from "@tcg/grand-archive-types";
import { buildInteractionSubmission } from "@tcg/protocol";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

// Engine-only contract fixture. This is not a playable card or browser evidence.
function generationCard(
  count: GrandArchiveSelectionCount,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: "adapter-repeat",
    slug: "adapter-repeat",
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: "adapter-repeat:face",
        catalogId: "adapter-repeat",
        name: "Repeated generation contract",
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "slow",
        stats: {},
        rulesText: "Generate selected swords.",
        abilities: [
          {
            id: "adapter-repeat-a1",
            kind: "card-resolution",
            text: "Generate selected swords.",
            effect: {
              kind: "generate-selected",
              player: "controller",
              selection: {
                id: "generated-swords",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count,
                allowRepeated: true,
                candidates: { kind: "catalog-card", filter: { kind: "subtype", oneOf: ["SWORD"] } },
              },
              destination: { zone: "field" },
            },
          },
        ],
      },
    },
  };
}

it.each([
  { kind: "exactly", amount: 2 },
  { kind: "any-number" },
] satisfies GrandArchiveSelectionCount[])(
  "represents native repeated catalog selection as counts ($kind)",
  (count) => {
    const card = generationCard(count);
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion: spiritOfWind, zones: { hand: [card] } },
      playerTwo: { id: "p2", champion: spiritOfWind },
      definitions: [swordOfAdversity],
    });
    engine.player("p1").activate(card);
    expect(engine.resolveStackUntilChoice()).toBe("decision");
    const server = new GrandArchiveServerEngine(
      engine.program,
      new GrandArchiveMatchRuntime(engine.program, engine.state),
    );
    const view = server.getInteractionView("p1");
    const action = view.actions.find((action) =>
      action.inputs.some((input) => input.kind === "entity-allocation"),
    );
    if (!action) throw new Error("Expected repeated selection action");
    const input = action.inputs.find((input) => input.kind === "entity-allocation");
    if (!input || input.kind !== "entity-allocation") throw new Error("Expected counts");
    const id = swordOfAdversity.canonicalId;
    expect(input.candidates).toHaveLength(1);
    expect(input.candidates[0]?.text?.key).toBe("Sword of Adversity");
    expect(input.totalMin).toBe(count.kind === "exactly" ? 2 : 0);
    expect(input.totalMax).toBe(count.kind === "exactly" ? 2 : Number.MAX_SAFE_INTEGER);
    const resources = server.getViewerResources({ role: "player", actorId: "p1" });
    expect(
      "authorizedCardDefinitionIds" in resources && resources.authorizedCardDefinitionIds?.[id],
    ).toBe(id);
    expect("cardImageUrls" in resources && resources.cardImageUrls?.[id]).toBeTruthy();
    for (const projection of [
      projectGrandArchiveSimulator(engine.program, engine.state, grandArchivePlayerId("p1")),
      projectGrandArchiveViewerSimulator(server.getViewerState({ role: "player", actorId: "p1" }), {
        ...resources,
        interactionView: view,
      }),
    ])
      expect(projection.entities.find((entity) => entity.id === id)).toMatchObject({
        title: "Sword of Adversity",
        imageUrl: expect.any(String),
      });
    const observer = server.getViewerResources({ role: "player", actorId: "p2" });
    expect(
      "authorizedCardDefinitionIds" in observer && observer.authorizedCardDefinitionIds,
    ).toEqual({});
    const submit = (values: Record<string, number>) =>
      server.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: { [input.id]: values } }),
        { gameId: "repeat", sourceAuthority: "server" },
      );
    expect(() => submit({ [id]: 1.5 })).toThrow();
    if (count.kind === "exactly") expect(submit({ [id]: 3 }).success).toBe(false);
    expect(submit({ [id]: 2 }).success).toBe(true);
    expect(server.runtime.state.decision).toBeNull();
    expect(
      server.runtime.state.zones[grandArchivePlayerId("p1")].field.filter(
        (objectId) => server.runtime.state.objects[objectId]?.definitionId === id,
      ),
    ).toHaveLength(2);
  },
);
