import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04KinEmon024 } from "../../../../../cards/src/cards/OP14EB04/characters/024-kin-emon.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-024 Kin'emon", () => {
  test("on play activates up to three DON!! and prevents Character plays only this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04KinEmon024, eb01Doma005],
      activeDon: op14eb04KinEmon024.cost,
      restedDon: 3,
    });
    const domaId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04KinEmon024, "south");
    const count = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Kin'emon's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2", "3"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "3" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 3, restedDon: 4 });
    expect(
      engine.expectFailure({ type: "playCard", seat: "south", instanceId: domaId }).reason,
    ).toBe("A card effect prevents this card from being played.");

    engine.endTurn("south");
    engine.endTurn("north");
    engine.playCard(eb01Doma005, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may rest one selected opposing card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04KinEmon024, rested: true }], hand: [eb01Doma005] },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
        hand: [],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kinemonId = engine.findCardInZone("south", "character", op14eb04KinEmon024);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, kinemonId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const decision = engine.pendingDecision("effectMixedRestSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "payCost") throw new Error("Expected Kin'emon's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kinemonId);
    expect(view.prompts).toHaveLength(0);
  });
});
