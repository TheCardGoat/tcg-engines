import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01Shirahoshi057, eb01TBone049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-057 Shirahoshi", () => {
  test("maps itself as Blocker without firing its effect-only On K.O. after battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Shirahoshi057],
        deck: [
          eb01Fourtricks025,
          eb01Doma005,
          eb01Fourtricks025,
          eb01Doma005,
          eb01Fourtricks025,
          eb01Doma005,
        ],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shirahoshiId = engine.findCardInZone("south", "character", eb01Shirahoshi057);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") {
      throw new Error("Expected Shirahoshi's Blocker choice.");
    }
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", shirahoshiId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [shirahoshiId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      shirahoshiId,
    );
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("adds the top deck card face-down to top Life after an opponent effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb01Shirahoshi057],
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      {
        hand: [eb01TBone049],
        activeDon: 5,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shirahoshiId = engine.findCardInZone("south", "character", eb01Shirahoshi057);
    const topDeckId = engine.getState().players.south.deck[0]!;

    engine.playCard(eb01TBone049, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shirahoshiId] }, "north");

    const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    expect(addLife?.kind).toBe("chooseOption");
    if (addLife?.kind !== "chooseOption") {
      throw new Error("Expected Shirahoshi's optional top-deck-to-Life count.");
    }
    expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(engine.getState().cards[topDeckId]?.faceUp).toBe(false);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      shirahoshiId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
