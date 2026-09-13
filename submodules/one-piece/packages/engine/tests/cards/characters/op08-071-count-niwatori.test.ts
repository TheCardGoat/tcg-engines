import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08BaronTamago070,
  op08CountNiwatori071,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-071 Count Niwatori", () => {
  test("on the opponent's turn returns 1 DON!! to play Baron Tamago from deck, then shuffles", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08CountNiwatori071, rested: true, playedOnTurn: 0 }],
        deck: [op08BaronTamago070, eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const niwatoriId = engine.findCardInZone("south", "character", op08CountNiwatori071);
    const tamagoId = engine.findCardInZone("south", "deck", op08BaronTamago070);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, niwatoriId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Niwatori's Baron Tamago choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([tamagoId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [tamagoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(niwatoriId);
    expect(view.players.south.characters.some((card) => card?.instanceId === tamagoId)).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08CountNiwatori071, rested: true, playedOnTurn: 0 }],
        deck: [op08BaronTamago070, eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const niwatoriId = engine.findCardInZone("south", "character", op08CountNiwatori071);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, niwatoriId, "north");
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
