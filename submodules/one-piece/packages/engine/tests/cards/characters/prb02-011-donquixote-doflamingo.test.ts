import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb02DonquixoteDoflamingo011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-011 Donquixote Doflamingo", () => {
  test("with a multicolored Leader adds rested DON!! on play and then blocks", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02DonquixoteDoflamingo011],
        activeDon: prb02DonquixoteDoflamingo011.cost,
        donDeckCount: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );

    engine.playCard(prb02DonquixoteDoflamingo011, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const doflamingoId = engine.findCardInZone("south", "character", prb02DonquixoteDoflamingo011);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    expect(engine.getView("south").players.south).toMatchObject({ restedDon: 6, donDeckCount: 0 });

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Doflamingo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(doflamingoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [doflamingoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(doflamingoId);
    expect(view.prompts).toHaveLength(0);
  });
});
