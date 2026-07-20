import { op10Trebol070, st01MonkeyDLuffy012 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02SanjiSt21003PirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-sanji-st21-003-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST21-003 Sanji", () => {
  test("selected eligible Straw Hat Crew attacker cannot be blocked this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02SanjiSt21003PirateFoil003],
        character: [{ card: st01MonkeyDLuffy012, playedOnTurn: 0 }],
        activeDon: prb02SanjiSt21003PirateFoil003.cost,
      },
      { character: [op10Trebol070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", st01MonkeyDLuffy012);

    engine.playCard(prb02SanjiSt21003PirateFoil003, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sanji's attacker choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([attackerId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow();
    const view = engine.getView("north");
    expect(view.players.north.characters[0]?.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may select no attacker, leaving its attack blockable", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02SanjiSt21003PirateFoil003],
        character: [{ card: st01MonkeyDLuffy012, playedOnTurn: 0 }],
        activeDon: prb02SanjiSt21003PirateFoil003.cost,
      },
      { character: [op10Trebol070] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", st01MonkeyDLuffy012);
    const blockerId = engine.findCardInZone("north", "character", op10Trebol070);

    engine.playCard(prb02SanjiSt21003PirateFoil003, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected the legal Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
