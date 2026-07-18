import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Shuraiya009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function shuraiyaPower(engine: OnePieceTestEngine, shuraiyaId: string) {
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === shuraiyaId)?.power;
}

describe("OP06-009 Shuraiya", () => {
  test("copies the opposing Leader's base power when attacking until the start of its next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Shuraiya009, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shuraiyaId = engine.findCardInZone("south", "character", op06Shuraiya009);

    engine.declareAttack(shuraiyaId, engine.leader("north"), "south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(5000);

    engine.endTurn("south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(5000);
    engine.endTurn("north");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(4000);
  });

  test("copies the opposing Leader's base power on block before the Counter Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Shuraiya009], hand: [eb01Doma005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shuraiyaId = engine.findCardInZone("south", "character", op06Shuraiya009);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shuraiya as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shuraiyaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shuraiyaId] }, "south");

    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(5000);
  });
});
