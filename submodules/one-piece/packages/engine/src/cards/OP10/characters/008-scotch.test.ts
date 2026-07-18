import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Rock017, op10Scotch008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-008 Scotch", () => {
  test("plays Rock from hand only while no Rock is already on its field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Scotch008, op10Rock017],
      activeDon: op10Scotch008.cost,
    });
    const rockId = engine.findCardInZone("south", "hand", op10Rock017);

    engine.playCard(op10Scotch008, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Scotch's Rock choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(rockId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [rockId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(rockId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer another Rock when one is already on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Scotch008, op10Rock017],
      character: [op10Rock017],
      activeDon: op10Scotch008.cost,
    });
    const handRockId = engine.findCardInZone("south", "hand", op10Rock017);

    engine.playCard(op10Scotch008, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handRockId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests through the defending player's Blocker choice and redirects the attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Scotch008] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const scotchId = engine.findCardInZone("south", "character", op10Scotch008);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Scotch's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(scotchId);
    engine.resolveDecision("battleBlocker", { selectedIds: [scotchId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(scotchId);
    expect(view.prompts).toHaveLength(0);
  });
});
