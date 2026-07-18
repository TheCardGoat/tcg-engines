import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op11Doll008, op11Koby001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-008 Doll", () => {
  test("may trash a physical hand card to reduce an opposing Character by 6000 with a Navy Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        hand: [op11Doll008, eb01Doma005, eb01Fourtricks025],
        activeDon: 4,
      },
      { character: [eb01Doma005] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Doll008, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      -3000,
    );
  });

  test("pays the hand-trash cost before a non-Navy Leader prevents the reduction", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11Doll008, eb01Doma005], activeDon: 4 },
      { character: [eb01Doma005] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Doll008, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may block an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Doll008] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const dollId = engine.findCardInZone("south", "character", op11Doll008);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [dollId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
