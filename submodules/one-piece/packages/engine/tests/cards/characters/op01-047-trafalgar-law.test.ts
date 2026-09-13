import { describe, expect, test } from "vite-plus/test";
import {
  op01JeanBart045,
  op01Nekomamushi048,
  op01Shinobu043,
  op01TrafalgarLaw047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-047 Trafalgar Law", () => {
  test("optionally returns one Character as its On Play cost before playing a cost-3 Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01TrafalgarLaw047, op01Shinobu043],
      character: [op01JeanBart045],
      activeDon: 5,
    });
    const jeanBartId = engine.findCardInZone("south", "character", op01JeanBart045);
    const shinobuId = engine.findCardInZone("south", "hand", op01Shinobu043);

    engine.playCard(op01TrafalgarLaw047, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Law's return cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(jeanBartId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [jeanBartId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([shinobuId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [shinobuId] }, "south");

    expect(engine.findCardInZone("south", "hand", op01JeanBart045)).toBe(jeanBartId);
    expect(engine.findCardInZone("south", "character", op01Shinobu043)).toBe(shinobuId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can become the attack target as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01TrafalgarLaw047, playedOnTurn: 0 }] },
      { character: [{ card: op01Nekomamushi048, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", op01TrafalgarLaw047);
    const attackerId = engine.findCardInZone("north", "character", op01Nekomamushi048);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Law as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(lawId);
    engine.resolveDecision("battleBlocker", { selectedIds: [lawId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === lawId)
        ?.rested,
    ).toBe(true);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01TrafalgarLaw047, op01Shinobu043],
      character: [op01JeanBart045],
      activeDon: 5,
    });
    engine.playCard(op01TrafalgarLaw047, "south");
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
