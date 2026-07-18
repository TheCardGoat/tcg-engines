import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Chew029, op03Fukurou088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-088 Fukurou", () => {
  test("is offered through Blocker and can be K.O.'d by the resulting battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Fukurou088] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fukurouId = engine.findCardInZone("south", "character", op03Fukurou088);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Fukurou's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(fukurouId);
    engine.resolveDecision("battleBlocker", { selectedIds: [fukurouId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      fukurouId,
    );
  });

  test("cannot be K.O.'d by an opponent effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op03Fukurou088, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { hand: [op03Chew029], activeDon: op03Chew029.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fukurouId = engine.findCardInZone("south", "character", op03Fukurou088);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op03Chew029, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chew's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(fukurouId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === fukurouId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(fukurouId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });
});
