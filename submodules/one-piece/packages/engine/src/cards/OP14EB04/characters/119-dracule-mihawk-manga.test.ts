import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb02Enel052 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04DraculeMihawkManga119 } from "../../../../../cards/src/cards/OP14EB04/characters/119-dracule-mihawk-manga.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-119 Dracule Mihawk", () => {
  test("when rested on its turn prevents an opposing cost-9 Character from resting through that opponent's next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04DraculeMihawkManga119, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb02Enel052, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mihawkId = engine.findCardInZone("south", "character", op14eb04DraculeMihawkManga119);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb02Enel052);

    engine.declareAttack(mihawkId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Mihawk's rest restriction.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: eligibleId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(eligibleId, engine.leader("south"), "north");
  });

  test("on an opponent's attack may trash one selected hand card and give an own battle target +2000 once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04DraculeMihawkManga119, eb01Doma005],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const firstAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const ownCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const keptId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Mihawk's hand-trash cost.");
    expect(cost).toMatchObject({ min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Mihawk's battle target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), ownCharacterId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the opponent-attack effect without paying or changing power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04DraculeMihawkManga119], hand: [eb01Doma005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });
});
