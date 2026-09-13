import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Nami040 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-040 Nami", () => {
  test("wins instead of losing when her damage trigger trashes the final deck card", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03Nami040, deck: [eb01Doma005], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const finalDeckCardId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(finalDeckCardId);
    expect(engine.getState()).toMatchObject({ status: "finished", winner: "south" });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op03Nami040, deck: [eb01Doma005], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
