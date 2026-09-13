import { describe, expect, test } from "vite-plus/test";
import { op10Koala047 } from "../../../../../cards/src/cards/OP10/characters/047-koala.ts";
import { op10Sabo049 } from "../../../../../cards/src/cards/OP10/characters/049-sabo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-047 Koala", () => {
  test("returns a compound-trait Revolutionary Army cost-3-or-more Character before gaining power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Koala047, playedOnTurn: 0 }, op10Sabo049] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const koalaId = engine.findCardInZone("south", "character", op10Koala047);
    const saboId = engine.findCardInZone("south", "character", op10Sabo049);
    engine.declareAttack(koalaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(saboId);
    expect(view.players.south.characters.find((card) => card?.instanceId === koalaId)?.power).toBe(
      6000,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Koala047, playedOnTurn: 0 }, op10Sabo049] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const koalaId = engine.findCardInZone("south", "character", op10Koala047);
    engine.declareAttack(koalaId, engine.leader("north"), "south");
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
