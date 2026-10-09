import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-059-the-world-s-continuation", () => {
  test.each([0, 1, 2])("Counter uses %s returned Characters for its chosen recipient", (count) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 3 },
      {
        leaderCardId: "ST11-001",
        hand: ["P-059", "ST02-012"],
        activeDon: 2,
        character: [{ cardId: "ST02-002", attachedDon: 1 }, "ST02-006"],
      },
    );
    const ids = e
      .getView("north")
      .players.north.characters.flatMap((c) => (c?.instanceId ? [c.instanceId] : []));
    e.asSouth().attachDon(e.leader("south"), 3);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("P-059");
    e.asNorth().chooseTargets(...ids.slice(0, count));
    e.asNorth().chooseTargets(e.leader("north"));
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.handCount).toBe(1 + count + (count < 2 ? 1 : 0));
    expect(e.getView("north").players.north.restedDon).toBe(2 + (count > 0 ? 1 : 0));
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.lifeCount).toBe(count === 2 ? 5 : 4);
  });
  test("wrong Leader pays Event cost but cannot return Characters or add power", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 3 },
      {
        leaderCardId: "ST01-001",
        hand: ["P-059", "ST02-012"],
        activeDon: 2,
        character: ["ST02-002"],
      },
    );
    e.asSouth().attachDon(e.leader("south"), 3);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter("P-059");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.restedDon).toBe(2);
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
  test.each([true, false])("remaining Character power recipient selected=%s", (boost) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", activeDon: 1 },
      {
        leaderCardId: "ST11-001",
        hand: ["P-059"],
        activeDon: 2,
        character: [{ cardId: "ST02-002", rested: true }, "ST02-006", "ST02-012"],
      },
    );
    const target = e.findCardInZone("north", "character", "ST02-002"),
      a = e.findCardInZone("north", "character", "ST02-006"),
      b = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), target);
    e.asNorth().chooseCounter("P-059");
    e.asNorth().chooseTargets(a, b);
    const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recipient");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([e.leader("north"), target]);
    e.asNorth().chooseTargets(...(boost ? [target] : []));
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === target)).toBe(
      boost,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === target)).toBe(
      !boost,
    );
  });
});
