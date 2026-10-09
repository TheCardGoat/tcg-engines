import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-003 Kaku", () => {
  test.each([1, 2, 3])("live own Life %s compared with opponent two", (life) => {
    const e = OnePieceTestEngine.create({ hand: ["ST29-003"], activeDon: 4, life }, { life: 2 });
    e.asSouth().play("ST29-003");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(life <= 2 ? 6000 : 5000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(life <= 2 ? 6000 : 5000);
  });
  test("Trigger KOs opposing cost three and excludes four", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST29-002", "ST29-003"] },
      { life: ["ST29-003", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const low = e.findCardInZone("south", "character", "ST29-002"),
      high = e.findCardInZone("south", "character", "ST29-003");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([low]);
    e.asNorth().chooseTargets(low);
    expect(e.getView("north").players.south.trash.map((c) => c.instanceId)).toContain(low);
    expect(e.getView("north").players.south.characters.map((c) => c?.instanceId)).toContain(high);
  });
  test("continuous comparison updates when opponent loses Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST29-003"], life: 2 },
      { life: 2 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });
});
