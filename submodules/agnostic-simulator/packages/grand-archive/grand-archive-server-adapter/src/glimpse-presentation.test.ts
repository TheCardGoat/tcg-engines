import { expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  spiritOfWater,
  arisannaHerbalistProdigy,
  arisannaMasterAlchemist,
  arisannaAstralZenith,
  scryTheStars,
  giantTortoise,
  spiritOfFire,
  spiritOfWind,
  raiSpellcrafter,
  raiArchmage,
  scryTheSkies,
  woodlandSquirrels,
  grayWolf,
  favorableWinds,
} from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { GrandArchiveMatchRuntime } from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { projectGrandArchiveSimulator, projectGrandArchiveViewerSimulator } from "./projection.ts";

it("keeps native Glimpse art chooser-only and treats its fixed reorder operation as implicit", () => {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfFire,
      lineage: [raiSpellcrafter, raiArchmage],
      zones: { hand: [scryTheSkies, woodlandSquirrels], "main-deck": [grayWolf, favorableWinds] },
    },
    playerTwo: { id: "p2", champion: spiritOfWind },
  });
  engine.player("p1").activate(scryTheSkies, {
    reservePayment: [
      { kind: "card", cardId: engine.player("p1").card(woodlandSquirrels).objectId },
    ],
  });
  expect(engine.resolveStackUntilChoice()).toBe("decision");
  expect(engine.state.decision?.kind).toBe("resolve-glimpse");
  const server = new GrandArchiveServerEngine(
    engine.program,
    new GrandArchiveMatchRuntime(engine.program, engine.state),
  );
  const view = server.getInteractionView("p1");
  const action = view.actions.find((action) =>
    action.inputs.some((input) => input.id === "glimpse-order"),
  )!;
  const input = action.inputs.find((input) => input.id === "glimpse-order");
  if (!input || input.kind !== "entity-partition")
    throw new Error("Expected native Glimpse partition");
  expect(action.inputs.find((input) => input.id === "glimpse-action")).toMatchObject({
    implicit: true,
    required: true,
    options: [{ id: "reorder", text: { key: "Return cards to deck" } }],
  });
  const resources = server.getViewerResources({ role: "player", actorId: "p1" });
  if (!("authorizedCardDefinitionIds" in resources)) throw new Error("Expected player resources");
  const direct = projectGrandArchiveSimulator(
    engine.program,
    engine.state,
    grandArchivePlayerId("p1"),
    resources,
  );
  const serialized = projectGrandArchiveViewerSimulator(
    server.getViewerState({ role: "player", actorId: "p1" }),
    { ...resources, interactionView: view },
  );
  const ids = input.candidates.map((candidate) => candidate.entity.instanceId);
  expect(ids).toHaveLength(2);
  for (const id of ids) {
    expect(resources.authorizedCardDefinitionIds?.[id]).toBeTruthy();
    expect(resources.cardImageUrls?.[id]).toMatch(/^https:\/\//);
    for (const projection of [direct, serialized])
      expect(projection.entities.find((entity) => entity.id === id)?.imageUrl).toBe(
        resources.cardImageUrls?.[id],
      );
  }
  const opponentResources = server.getViewerResources({ role: "player", actorId: "p2" });
  expect(
    "authorizedCardDefinitionIds" in opponentResources &&
      opponentResources.authorizedCardDefinitionIds,
  ).toEqual({});
  for (const id of ids)
    expect(
      "cardImageUrls" in opponentResources && opponentResources.cardImageUrls?.[id],
    ).toBeUndefined();
  const opponent = projectGrandArchiveViewerSimulator(
    server.getViewerState({ role: "player", actorId: "p2" }),
    { ...opponentResources, interactionView: server.getInteractionView("p2") },
  );
  expect(opponent.entities.some((entity) => ids.includes(entity.id))).toBe(false);
  const submitted = server.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action,
      values: {
        "glimpse-action": ["reorder"],
        "glimpse-order": { top: [ids[0]!], bottom: [ids[1]!] },
      },
    }),
    { gameId: "glimpse-presentation", sourceAuthority: "server" },
  );
  expect(submitted.success).toBe(true);
  expect(server.runtime.state.decision).toBeNull();
  expect(server.runtime.state.zones[grandArchivePlayerId("p1")].memory).toContain(ids[0]);
});

function starcallServer(multipleEligible = false) {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfWater,
      lineage: [arisannaHerbalistProdigy, arisannaMasterAlchemist, arisannaAstralZenith],
      zones: {
        hand: [scryTheStars, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        "main-deck": [
          woodlandSquirrels,
          multipleEligible ? woodlandSquirrels : grayWolf,
          giantTortoise,
          favorableWinds,
        ],
      },
    },
    playerTwo: { id: "p2", champion: spiritOfWind },
  });
  engine.player("p1").activate(scryTheStars, {
    reservePayment: engine.state.zones[grandArchivePlayerId("p1")].hand
      .filter((id) => engine.state.objects[id]?.definitionId === woodlandSquirrels.canonicalId)
      .map((cardId) => ({ kind: "card", cardId })),
  });
  expect(engine.resolveStackUntilChoice()).toBe("decision");
  return new GrandArchiveServerEngine(
    engine.program,
    new GrandArchiveMatchRuntime(engine.program, engine.state),
  );
}

it("omits illegal reserve payments from a real free Starcall choice", () => {
  const server = starcallServer();
  const state = server.runtime.state;
  const view = server.getInteractionView("p1");
  expect(server.runtime.state).toBe(state);
  const action = view.actions.find((action) =>
    action.inputs.some((input) => input.id === "glimpse-action"),
  );
  if (!action) throw new Error("Expected Starcall");
  expect(action.inputs.some((input) => input.id === "reservePayment")).toBe(false);
  const choice = action.inputs.find((input) => input.id === "cardId");
  expect(choice?.kind).toBe("entity-selection");
  if (choice?.kind !== "entity-selection") throw new Error("Expected Starcall card selection");
  const legalIds = choice.candidates.map((candidate) => candidate.entity.instanceId);
  const order = action.inputs.find((input) => input.id === `starcall-order:${legalIds[0]}`);
  if (order?.kind !== "entity-partition") throw new Error("Expected Starcall partition");
  const starcall = order.routes.find((route) => route.id === "starcall");
  expect(starcall?.candidateIds).toEqual(legalIds);
  expect(legalIds).toHaveLength(1);
  const viewedIds = order.candidates.map((candidate) => candidate.entity.instanceId);
  const illegalId = viewedIds.find((id) => !legalIds.includes(id));
  if (!illegalId) throw new Error("Expected a viewed card that cannot be Starcalled");
  const result = server.submitInteraction(
    "p1",
    buildInteractionSubmission({
      view,
      action,
      values: {
        "glimpse-action": ["starcall"],
        cardId: legalIds,
        [order.id]: {
          starcall: [illegalId],
          bottom: viewedIds.filter((id) => id !== illegalId),
        },
      },
    }),
    { gameId: "starcall-route-validation", sourceAuthority: "server" },
  );
  expect(result.success).toBe(false);
  expect(server.runtime.state).toBe(state);
});

it("keeps reorder destinations separate from each selected Starcall card", () => {
  const server = starcallServer(true);
  const view = server.getInteractionView("p1");
  const action = view.actions.find((entry) =>
    entry.inputs.some((input) => input.id === "glimpse-action"),
  );
  if (!action) throw new Error("Expected Glimpse action");
  const reorder = action.inputs.find((input) => input.id === "glimpse-order");
  if (reorder?.kind !== "entity-partition") throw new Error("Expected reorder partition");
  expect(reorder.routes.map((route) => route.id).sort()).toEqual(["bottom", "top"]);
  expect(reorder.requiredWhen).toEqual([
    { all: [{ inputId: "glimpse-action", value: ["reorder"] }] },
  ]);
  const choice = action.inputs.find((input) => input.id === "cardId");
  if (choice?.kind !== "entity-selection") throw new Error("Expected Starcall selection");
  const eligible = choice.candidates.map((candidate) => candidate.entity.instanceId);
  expect(eligible).toHaveLength(2);
  for (const cardId of eligible) {
    const partition = action.inputs.find((input) => input.id === `starcall-order:${cardId}`);
    if (partition?.kind !== "entity-partition")
      throw new Error("Expected card-specific Starcall partition");
    expect(partition.routes.map((route) => route.id).sort()).toEqual(["bottom", "starcall"]);
    expect(partition.routes.find((route) => route.id === "starcall")).toMatchObject({
      min: 1,
      max: 1,
      candidateIds: [cardId],
    });
    expect(partition.routes.find((route) => route.id === "bottom")?.candidateIds).not.toContain(
      cardId,
    );
    expect(
      partition.requiredWhen?.every((requirement) =>
        requirement.all.some(
          (condition) =>
            condition.inputId === "cardId" &&
            Array.isArray(condition.value) &&
            condition.value[0] === cardId,
        ),
      ),
    ).toBe(true);
  }
  const ids = reorder.candidates.map((candidate) => candidate.entity.instanceId);
  expect(
    server.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: { "glimpse-action": ["reorder"], "glimpse-order": { top: ids, bottom: [] } },
      }),
      { gameId: "reorder-branch", sourceAuthority: "server" },
    ).success,
  ).toBe(true);
});
