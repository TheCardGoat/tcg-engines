import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-051-shanks", () => {
  test.each([0, 1, 2])("actual trash count %s sets battle-only power", (count) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-051"], hand: ["ST02-002", "ST02-006"] },
      { leaderCardId: "ST01-001", hand: ["ST02-002"] },
    );
    const id = e.findCardInZone("south", "character", "P-051"),
      hand = e
        .getView("south")
        .players.south.hand.flatMap((c) => (c.instanceId ? [c.instanceId] : []));
    e.asSouth().attack(id, e.leader("north"));
    const step = e.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(step).toMatchObject({ min: 0, max: 2 });
    e.asSouth().trashFromHand(...hand.slice(0, count));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000 + count * 1000);
    expect(e.getView("south").players.south.handCount).toBe(2 - count);
    e.asNorth().chooseCounter();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000);
  });
  test("empty hand cannot create power", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["P-051"] },
      { leaderCardId: "ST01-001", hand: ["ST02-002"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "P-051"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(9000);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
});
