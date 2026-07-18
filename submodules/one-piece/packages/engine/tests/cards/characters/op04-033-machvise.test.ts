import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01DonquixoteDoflamingo060,
  op01Kaido094,
  op04Machvise033,
  op13BrilliantPunk059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-033 Machvise", () => {
  test("rests an opposing cost-5 Character and activates DON!! only at turn end after leaving play", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [op04Machvise033, op13BrilliantPunk059],
        character: [eb01Doma005],
        activeDon: op04Machvise033.cost + op13BrilliantPunk059.cost,
        restedDon: 1,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Kaido094, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0, rested: true },
        ],
      },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op01Kaido094);
    const alreadyRestedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04Machvise033, "south");
    const machviseId = engine.findCardInZone("south", "character", op04Machvise033);

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Machvise's rest target.");
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(alreadyRestedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 4, restedDon: 5 });

    engine.playCard(op13BrilliantPunk059, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected Brilliant Punk's return cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, machviseId]),
    );
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [machviseId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(machviseId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 9 });

    engine.endTurn("south");
    const refresh = engine.pendingDecision("effectSetActiveDon", "south");
    expect(refresh.actorId).toBe("south");
    expect(refresh.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(machviseId);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 8 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no Character and later choose to activate zero DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01DonquixoteDoflamingo060,
        hand: [op04Machvise033],
        activeDon: op04Machvise033.cost,
        restedDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04Machvise033, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });

    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });

  test("does nothing without a Donquixote Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Machvise033], activeDon: op04Machvise033.cost, restedDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04Machvise033, "south");

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });
});
