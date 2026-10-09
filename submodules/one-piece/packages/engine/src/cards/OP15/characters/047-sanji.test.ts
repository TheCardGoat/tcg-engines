import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Sanji047 } from "../../../../../cards/src/cards/characters/op15-047-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-047 Sanji", () => {
  test("Blocker redirects an opposing Leader attack away from Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Sanji047], hand: [], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op15Sanji047);
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] grants Unblockable to one Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Sanji047], character: [eb01Doma005], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op15Sanji047);
    const sanjiId = engine.findCardInZone("south", "character", op15Sanji047);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the Unblockable target.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toHaveLength(2);
    expect(candidates).toContain(sanjiId);
    expect(candidates).toContain(domaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    // The boosted Doma attacks and the opponent cannot block him.
    engine.declareAttack(domaId, engine.leader("north"), "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
