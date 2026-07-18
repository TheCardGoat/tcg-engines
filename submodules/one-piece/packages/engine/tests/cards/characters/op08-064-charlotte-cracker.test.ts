import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08BiscuitWarrior072, op08CharlotteCracker064 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-064 Charlotte Cracker", () => {
  test("once per turn may return a DON!! to play only Biscuit Warrior from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08BiscuitWarrior072, eb01Doma005],
      character: [op08CharlotteCracker064],
      activeDon: 2,
    });
    const crackerId = engine.findCardInZone("south", "character", op08CharlotteCracker064);
    const biscuitId = engine.findCardInZone("south", "hand", op08BiscuitWarrior072);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(crackerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity")
      throw new Error("Expected Cracker's Biscuit Warrior choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([biscuitId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [biscuitId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(biscuitId);
    expect(() => engine.activateEffect(crackerId, "activateMain", "south")).toThrow(
      /already been used this turn/,
    );
  });

  test("may decline without returning DON!! or playing Biscuit Warrior", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08BiscuitWarrior072],
      character: [op08CharlotteCracker064],
      activeDon: 1,
    });
    const crackerId = engine.findCardInZone("south", "character", op08CharlotteCracker064);
    const biscuitId = engine.findCardInZone("south", "hand", op08BiscuitWarrior072);

    engine.activateEffect(crackerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(biscuitId);
  });
});
