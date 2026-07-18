import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Inazuma050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-050 Inazuma", () => {
  test("gains +2000 power only while its controller has 1 or fewer cards in hand", () => {
    const powerWithHand = (hand: (typeof eb01Doma005)[]) => {
      const engine = OnePieceTestEngine.create({
        hand,
        character: [{ card: op02Inazuma050, playedOnTurn: 0 }],
      });
      const inazumaId = engine.findCardInZone("south", "character", op02Inazuma050);
      return engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === inazumaId)?.power;
    };

    expect(powerWithHand([eb01Doma005, eb01Doma005])).toBe(5000);
    expect(powerWithHand([eb01Doma005])).toBe(7000);
    expect(powerWithHand([])).toBe(7000);
  });

  test("rests as a Blocker, redirects a Leader attack, and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op02Inazuma050, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const inazumaId = engine.findCardInZone("north", "character", op02Inazuma050);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Inazuma's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(inazumaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [inazumaId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(inazumaId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
