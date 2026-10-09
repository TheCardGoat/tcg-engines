import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op06Shuraiya009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function shuraiyaPower(engine: OnePieceTestEngine, shuraiyaId: string) {
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === shuraiyaId)?.power;
}

describe("OP06-009 Shuraiya", () => {
  test("copies the opposing Leader's current power when attacking until the start of its next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Shuraiya009, playedOnTurn: 0 }] },
      { character: ["OP15-092"], trash: 20 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shuraiyaId = engine.findCardInZone("south", "character", op06Shuraiya009);

    engine.declareAttack(shuraiyaId, engine.leader("north"), "south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(7000);

    engine.endTurn("south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(7000);
    engine.endTurn("north");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(4000);
  });

  test("copies the opposing Leader's current power on block before the Counter Step", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Shuraiya009], hand: [eb01Doma005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shuraiyaId = engine.findCardInZone("south", "character", op06Shuraiya009);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shuraiya as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shuraiyaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shuraiyaId] }, "south");

    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    expect(shuraiyaPower(engine, shuraiyaId)).toBe(7000);
  });
  test("does not copy again when blocking a second time in the same turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Shuraiya009], hand: ["OP01-057", eb01Doma005], activeDon: 1 },
      { character: [eb01MountainGod018], activeDon: 3 },
      { activeSeat: "north" },
    );
    const shuraiya = engine.findCardInZone("south", "character", op06Shuraiya009);
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [shuraiya] }, "south");
    expect(shuraiyaPower(engine, shuraiya)).toBe(7000);
    engine.resolveDecision(
      "battleCounter",
      {
        selectedIds: [engine.findCardInZone("south", "hand", "OP01-057")],
      },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shuraiya] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shuraiya] }, "south");
    engine.asSouth().chooseCounter();
    engine.attachDon(engine.leader("north"), 1, "north");
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [shuraiya] }, "south");
    expect(engine.getView("south").players.north.leader.power).toBe(8000);
    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    expect(shuraiyaPower(engine, shuraiya)).toBe(7000);
  });
});
