import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11Nami041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-041 Nami", () => {
  test("draws after Life is removed on her turn only while her hand is at seven or less", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Nami041, deck: [eb01Doma005] },
      { life: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    // "This effect can be activated when a card is removed from … Life" is optional.
    engine.accept("south");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the optional Life-removed draw", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Nami041, deck: [eb01Doma005] },
      { life: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.pendingDecision("effectOptional", "south").kind).toBe("confirm");
    engine.decline("south");

    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("maps the opponent-attack hand cost and keeps the power bonus for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11Nami041, hand: [eb01Doma005], activeDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(7000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: Hiyori's own Life exchange triggers the draw although Life count is restored", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP11-041",
      hand: ["OP06-106", "EB01-005"],
      life: ["EB01-018", "EB01-022"],
      activeDon: 2,
      deck: ["OP11-016", "EB01-005"],
    });
    const add = e.findCardInZone("south", "hand", "EB01-005");
    e.asSouth().play("OP06-106");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    e.asSouth().chooseTargets(add);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("OP11-016");
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
