import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04DonquixoteDoflamingo019,
  op04SenorPink026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { moveCard } from "../../../src/state.ts";

describe("OP04-026 Senor Pink", () => {
  test("resolves its scheduled end-turn DON!! after Senor Pink leaves play", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        character: [{ card: op04SenorPink026, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const senorPinkId = engine.findCardInZone("south", "character", op04SenorPink026);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(senorPinkId, engine.leader("north"), "south");
    expect(engine.pendingDecision("effectOptional", "south").steps[0]?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Senor Pink's rest choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(engine.getState().delayedEffectActions).toHaveLength(1);

    const endPhaseState = structuredClone(engine.getState());
    moveCard(endPhaseState, senorPinkId, "south", "trash", { actor: "system" });
    const endPhaseEngine = OnePieceTestEngine.fromState(endPhaseState);
    expect(
      endPhaseEngine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).toContain(senorPinkId);

    endPhaseEngine.endTurn("south");
    expect(endPhaseEngine.getState().phase).toBe("end");
    expect(endPhaseEngine.pendingDecision("effectSetActiveDon", "south").steps[0]?.kind).toBe(
      "chooseOption",
    );
    endPhaseEngine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(endPhaseEngine.getView("south").players.south).toMatchObject({
      activeDon: 2,
      restedDon: 0,
    });
    expect(endPhaseEngine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline without paying DON!!, resting a Character, or scheduling an action", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04DonquixoteDoflamingo019,
        character: [{ card: op04SenorPink026, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const senorPinkId = engine.findCardInZone("south", "character", op04SenorPink026);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(senorPinkId, engine.leader("north"), "south");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
    expect(engine.getState().delayedEffectActions).toHaveLength(0);
  });

  test("may pay the DON!! cost before a failed Leader condition fizzles both actions", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04SenorPink026, playedOnTurn: 0 }], activeDon: 2 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const senorPinkId = engine.findCardInZone("south", "character", op04SenorPink026);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(senorPinkId, engine.leader("north"), "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(engine.getState().delayedEffectActions).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
