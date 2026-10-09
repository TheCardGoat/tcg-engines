import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-018 Color of the Supreme King Haki", () => {
  test.each([true, false])("Rayleigh boost precedes optional DON rest: accept=%s", (accept) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP12-001", hand: ["OP12-018", "ST02-002"], activeDon: 1 },
      { character: ["OP16-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack("OP16-012", e.leader("south"));
    e.asSouth().chooseCounter("OP12-018");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    if (accept) {
      e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
      e.resolveDecision(
        "effectMixedRestSelection",
        { selectedIds: ["active-don:south:0"] },
        "south",
      );
    } else e.resolveDecision("effectActionOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(accept ? 0 : 1);
    expect(e.getView("south").players.north.leader.power).toBe(accept ? 4000 : 5000);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(accept ? 5000 : 6000);
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(5);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.asNorth().endTurn();
    expect(e.getView("south").players.north.leader.power).toBe(5000);
  });

  test("boosts a Character even when the Leader is not Rayleigh", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["ST02-002"], hand: ["OP12-018", "ST02-002"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const target = e.findCardInZone("south", "character", "ST02-002");
    const power = e.getView("south").players.south.characters[0]!.power!;
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter("OP12-018");
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(power + 2000);
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(power);
  });

  test("no active DON still boosts Rayleigh; already-rested DON cannot fund the reduction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP12-001", hand: ["OP12-018", "ST02-002"], restedDon: 2 },
      { character: ["OP16-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack("OP16-012", e.leader("south"));
    e.asSouth().chooseCounter("OP12-018");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    expect(e.getView("south").players.north.leader.power).toBe(5000);
    expect(e.getView("south").players.south.restedDon).toBe(2);
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(5);
  });

  test("a non-Rayleigh Leader is excluded but declining the boost still permits the DON payment", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        character: ["ST02-002"],
        hand: ["OP12-018", "ST02-002"],
        activeDon: 1,
      },
      { character: ["OP16-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack("OP16-012", e.leader("south"));
    e.asSouth().chooseCounter("OP12-018");
    const step = e.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (step.kind !== "selectEntity") throw Error("Expected boost targets");
    expect(step.candidates.map((c) => c.ref.id)).not.toContain(e.leader("south"));
    e.asSouth().chooseTargets();
    e.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectMixedRestSelection", { selectedIds: ["active-don:south:0"] }, "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.north.leader.power).toBe(4000);
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(4);
  });
});
