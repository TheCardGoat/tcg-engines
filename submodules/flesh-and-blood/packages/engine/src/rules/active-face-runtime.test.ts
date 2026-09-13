import { describe, expect, it } from "vitest";
import type { FabCardDefinitionInput } from "../cards.ts";
import type { FabCardLayout, FabPairedCardFace } from "@tcg/flesh-and-blood-types";
import { FabTestEngine } from "../testing/test-engine.ts";
import { nextFabDestinationRef, snapshotObject } from "./snapshots.ts";
import type { ProposedEvent } from "./events.ts";
import { commitProposedEventBatch } from "../kernel/transaction-kernel.ts";
import { reduceFabGameEvent } from "../kernel/event-reducer.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import {
  initialFabActiveFace,
  initialFabActiveFaceForCreatedName,
  resetFabActiveFace,
  selectFabActiveFace,
} from "../game/active-face.ts";
import { toFabCardDefinition } from "../cards.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";
import { projectFabViewerState } from "../view.ts";
import { loadFleshAndBloodStructuredCards } from "../../../cards/src/runtime-registry.ts";
import { figmentOfTenacityYellow } from "../../../cards/src/cards/instants/figment-of-tenacity.ts";
import { angelicAttendantYellow } from "../../../cards/src/cards/actions/angelic-attendant.ts";
import { stirThePotBlue } from "./fixtures.ts";
import { bravo, dash } from "./fixtures.ts";

const frontFaceId = "active-face-card:face:front" as const;
const backFaceId = "active-face-card:face:back" as const;

function face(
  faceId: typeof frontFaceId | typeof backFaceId,
  name: string,
  power: number,
  abilityId: string,
): FabPairedCardFace {
  return {
    faceId,
    name,
    typeText: "Action - Attack",
    types: ["Action", "Attack"],
    traits: [],
    text: name,
    keywords: [],
    numeric: { power },
    abilities: [
      {
        id: abilityId,
        kind: "static",
        text: name,
        staticKind: "property",
        property: "power",
        value: power,
      },
    ],
  };
}

function definition(kind: "flip" | "twin" | "transcend" = "flip"): FabCardDefinitionInput {
  const front = face(frontFaceId, "Front Face", 2, "front-a1");
  const back = face(backFaceId, "Back Face", 7, "back-a1");
  let layout: FabCardLayout;
  switch (kind) {
    case "flip":
      layout = { kind, family: "construct", front, back };
      break;
    case "twin":
      layout = { kind, front, back };
      break;
    case "transcend":
      layout = { kind, front, back };
      break;
  }
  return {
    canonicalId: "active-face-card",
    name: "Front Face",
    types: ["Action", "Attack"],
    layout,
  };
}

function stateWithDefinition(kind: "flip" | "twin" | "transcend" = "flip") {
  const card = definition(kind);
  const state = FabTestEngine.createStateForRulesTest({
    seed: "active-face-runtime",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: {
      canonicalIdsByInstance: { card1: card.canonicalId },
      owners: { p1: ["card1"], p2: [] },
    },
    cardDefinitions: { [card.canonicalId]: card },
  });
  return { card, state };
}

describe("CR 9.1 active-face runtime", () => {
  it("captures the selected face in an event-boundary snapshot", () => {
    const { state, card } = stateWithDefinition("twin");
    state.objects.card1 = {
      ...state.objects.card1!,
      activeFace: selectFabActiveFace(state.cardDefinitions[card.canonicalId]!, backFaceId),
    };

    expect(snapshotObject(state, "card1", "p1", "deck").activeFace).toEqual({
      kind: "paired",
      family: "twin",
      activeFaceIds: [backFaceId],
    });
  });

  it("changes face through the public event kernel while preserving the physical object", () => {
    const { state } = stateWithDefinition();
    const before = state.objects.card1!;
    const snapshot = snapshotObject(state, "card1", "p1", "deck");
    const proposal: ProposedEvent<"change-active-face"> = {
      name: "change-active-face",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "change-active-face" },
      controllerId: "p1",
      source: snapshot,
      affected: [snapshot],
      bindings: {},
      data: { object: snapshot, faceId: backFaceId },
    };

    const committed = commitProposedEventBatch(state, [proposal], reduceFabGameEvent).state;
    const after = committed.objects.card1!;
    const evaluated = buildFabRulesView(committed).object({
      instanceId: after.instanceId,
      incarnation: after.incarnation,
    });

    expect(after.instanceId).toBe(before.instanceId);
    expect(after.incarnation).toBe(before.incarnation);
    expect(after.activeFace).toEqual({
      kind: "paired",
      family: "flip",
      activeFaceIds: [backFaceId],
    });
    expect(evaluated?.current.names).toEqual(["Back Face"]);
    expect(evaluated?.current.numeric.power).toBe(7);
    expect(evaluated?.current.abilities.map((ability) => ability.id)).toEqual(["back-a1"]);
  });

  it("persists active face and only projects it when the card identity is visible", () => {
    const { card, state } = stateWithDefinition();
    state.objects.card1 = {
      ...state.objects.card1!,
      activeFace: selectFabActiveFace(state.cardDefinitions[card.canonicalId]!, backFaceId),
    };
    state.containers.zonesByPlayerId.p1!.deck = [];
    state.containers.zonesByPlayerId.p1!.hand = ["card1"];

    const persisted = serializeFabMatchSnapshot(state);
    const restored = restoreFabMatchSnapshot(
      persisted,
      createFabMatchContext({ [card.canonicalId]: card }, state.publicCardIdentities),
    );
    expect(restored.objects.card1!.activeFace).toEqual(state.objects.card1!.activeFace);
    expect(
      projectFabViewerState(restored, { role: "player", actorId: "p1" }).activeFaceIdsByInstanceId
        .card1,
    ).toEqual([backFaceId]);
    expect(
      projectFabViewerState(restored, { role: "player", actorId: "p2" }).activeFaceIdsByInstanceId,
    ).toEqual({});
    expect(
      projectFabViewerState(restored, { role: "spectator" }).activeFaceIdsByInstanceId,
    ).toEqual({});
  });

  it("applies family-specific initial and new-object reset policies", () => {
    const twin = toFabCardDefinition(definition("twin"));
    const transcend = toFabCardDefinition(definition("transcend"));

    expect(initialFabActiveFace(twin)).toMatchObject({
      family: "twin",
      activeFaceIds: [frontFaceId, backFaceId],
    });
    expect(initialFabActiveFace(twin, "inside")).toMatchObject({
      family: "twin",
      activeFaceIds: [frontFaceId],
    });
    expect(resetFabActiveFace(twin, selectFabActiveFace(twin, backFaceId))).toMatchObject({
      activeFaceIds: [frontFaceId, backFaceId],
    });
    expect(resetFabActiveFace(transcend, selectFabActiveFace(transcend, backFaceId))).toMatchObject(
      {
        family: "transcend",
        activeFaceIds: [backFaceId],
      },
    );
  });

  it("selects the requested twin face when an effect creates that token", () => {
    const twin = toFabCardDefinition(definition("twin"));
    expect(initialFabActiveFaceForCreatedName(twin, "Back Face")).toMatchObject({
      family: "twin",
      activeFaceIds: [backFaceId],
    });
    expect(initialFabActiveFaceForCreatedName(twin, "unrelated token")).toMatchObject({
      family: "twin",
      activeFaceIds: [frontFaceId],
    });
  });

  it("fails closed when persisted active-face state disagrees with its registered layout", () => {
    const { state } = stateWithDefinition();
    state.objects.card1 = {
      ...state.objects.card1!,
      activeFace: { kind: "paired", family: "twin", activeFaceIds: [frontFaceId] },
    };
    expect(() => serializeFabMatchSnapshot(state)).toThrowError("invalid face family");
  });

  it("makes a transcend back face active before its new-card hand reset", () => {
    const { state } = stateWithDefinition("transcend");
    const snapshot = snapshotObject(state, "card1", "p1", "deck");
    const proposal: ProposedEvent<"transcend"> = {
      name: "transcend",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "transcend" },
      controllerId: "p1",
      source: snapshot,
      affected: [snapshot],
      bindings: {},
      data: { actorId: "p1", object: snapshot },
    };

    const committed = commitProposedEventBatch(state, [proposal], reduceFabGameEvent).state;
    expect(committed.objects.card1!.activeFace).toMatchObject({
      family: "transcend",
      activeFaceIds: [backFaceId],
    });
    expect(committed.containers.zonesByPlayerId.p1!.hand).toContain("card1");
    expect(
      resetFabActiveFace(
        committed.cardDefinitions["active-face-card"]!,
        committed.objects.card1!.activeFace,
      ),
    ).toMatchObject({ activeFaceIds: [backFaceId] });
  });

  it("CR 9.1.3: an awaken event changes a physical Figment without replacing its identity", async () => {
    const cards = await loadFleshAndBloodStructuredCards([figmentOfTenacityYellow.canonicalId]);
    const physicalFigment = cards.get(figmentOfTenacityYellow.canonicalId);
    expect(physicalFigment?.layout).toMatchObject({ kind: "flip", family: "figment" });
    if (!physicalFigment) throw new Error("Expected physical Figment.");
    const state = FabTestEngine.createStateForRulesTest({
      seed: "physical-figment-awaken",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { figment: physicalFigment.canonicalId },
        owners: { p1: ["figment"], p2: [] },
      },
      cardDefinitions: { [physicalFigment.canonicalId]: physicalFigment },
    });
    const snapshot = snapshotObject(state, "figment", "p1", "arena");
    const committed = commitProposedEventBatch(
      state,
      [
        {
          name: "awaken",
          processId: "process-1",
          cause: { kind: "rule", rule: "test", controllerId: "p1" },
          controllerId: "p1",
          source: snapshot,
          affected: [snapshot],
          bindings: {},
          data: { object: snapshot, playerId: "p1" },
        },
      ],
      reduceFabGameEvent,
    ).state;

    expect(committed.objects.figment?.canonicalId).toBe(physicalFigment.canonicalId);
    expect(committed.objects.figment?.activeFace).toMatchObject({
      family: "flip",
      activeFaceIds: [`${physicalFigment.canonicalId}:face:back`],
    });
    expect(committed.objects.figment?.markers).toContainEqual({ kind: "awakened" });
  });

  it("CR 9.1.3: printed Angelic Attendant awakens the sole physical Figment target", async () => {
    const cards = await loadFleshAndBloodStructuredCards([
      figmentOfTenacityYellow.canonicalId,
      angelicAttendantYellow.canonicalId,
    ]);
    const figment = cards.get(figmentOfTenacityYellow.canonicalId);
    const attendant = cards.get(angelicAttendantYellow.canonicalId);
    if (!figment || !attendant) throw new Error("Expected physical Figment and Angelic Attendant.");
    const game = FabTestEngine.start(
      { hero: bravo, arena: [figment], hand: [attendant], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const figmentId = Bravo.findCardInZone("arena", figment);
    Bravo.play(attendant);
    // The sole legal target is auto-selected by the normal decision runner.
    game.passBoth();
    expect(game.getState().objects[figmentId]?.activeFace).toMatchObject({
      family: "flip",
      activeFaceIds: [`${figment.canonicalId}:face:back`],
    });
  });

  it("CR 9.1.5: physical Stir remains Inner Chi through pitch, discard, banish, restore, and reset", async () => {
    const cards = await loadFleshAndBloodStructuredCards([stirThePotBlue.canonicalId]);
    const stir = cards.get(stirThePotBlue.canonicalId);
    expect(stir?.layout.kind).toBe("transcend");
    if (!stir) throw new Error("Expected physical Stir the Pot.");
    let state = FabTestEngine.createStateForRulesTest({
      seed: "physical-stir-zone-lifecycle",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { stir: stir.canonicalId },
        owners: { p1: ["stir"], p2: [] },
      },
      cardDefinitions: { [stir.canonicalId]: stir },
    });
    const transcendSnapshot = snapshotObject(state, "stir", "p1", "deck");
    state = commitProposedEventBatch(
      state,
      [
        {
          name: "transcend",
          processId: "process-1",
          cause: { kind: "rule", rule: "test", controllerId: "p1" },
          controllerId: "p1",
          source: transcendSnapshot,
          affected: [transcendSnapshot],
          bindings: {},
          data: { actorId: "p1", object: transcendSnapshot },
        },
      ],
      reduceFabGameEvent,
    ).state;

    for (const [from, to] of [
      ["hand", "pitch"],
      ["pitch", "graveyard"],
      ["graveyard", "banished"],
      ["banished", "deck"],
    ] as const) {
      const object = snapshotObject(state, "stir", "p1", from);
      state = commitProposedEventBatch(
        state,
        [
          {
            name: "move-zone",
            processId: "process-1",
            cause: { kind: "rule", rule: "test", controllerId: "p1" },
            controllerId: "p1",
            source: object,
            affected: [object],
            bindings: {},
            data: {
              object,
              destinationRef: nextFabDestinationRef(state, object),
              from,
              to,
              reason: "move",
            },
          },
        ],
        reduceFabGameEvent,
      ).state;
      expect(state.objects.stir?.activeFace).toMatchObject({
        family: "transcend",
        activeFaceIds: [`${stir.canonicalId}:face:back`],
      });
    }
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext({ [stir.canonicalId]: stir }, state.publicCardIdentities),
    );
    expect(restored.objects.stir?.activeFace).toEqual(state.objects.stir?.activeFace);
  });

  it("CR 9.1.2b: naming offers individual physical DFC face names", async () => {
    const cards = await loadFleshAndBloodStructuredCards([stirThePotBlue.canonicalId]);
    const stir = cards.get(stirThePotBlue.canonicalId);
    if (!stir) throw new Error("Expected physical Stir the Pot.");
    const namer: FabCardDefinitionInput = {
      canonicalId: "test:name-double-faced-card",
      name: "Name a Card",
      types: ["Generic", "Action"],
      cost: 0,
      abilities: [
        {
          id: "test:name-double-faced-card-a1",
          kind: "resolution",
          text: "Name a card.",
          effect: { type: "name-card" },
        },
      ],
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [namer], deck: [stir, stir, stir, stir] },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(namer);
    game.passBoth();
    const decision = Bravo.expectDecision("effect-resolution");
    expect(decision.options.map((option) => option.label)).toEqual(
      expect.arrayContaining(["Stir the Pot", "Inner Chi"]),
    );
    expect(decision.options.some((option) => option.label.includes(" // "))).toBe(false);
    const innerChi = decision.options.find((option) => option.label === "Inner Chi");
    if (!innerChi) throw new Error("Expected Inner Chi as an individual name-card option.");
    game.answerDecision(Bravo.id, { kind: "effect-resolution", optionId: innerChi.id });
    game.passBoth();
    const heroId = game.getState().containers.zonesByPlayerId[Bravo.id]!.heroZone[0]!;
    expect(game.getState().objects[heroId]?.markers).toContainEqual({
      kind: "status",
      value: "named-card:Inner Chi",
    });
  });
});
