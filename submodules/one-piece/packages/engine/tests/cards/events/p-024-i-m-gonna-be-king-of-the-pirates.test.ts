import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P024 King of Pirates", () => {
  test.each([0, 2])("Main counts own Characters%s and expires", (count) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-024"], activeDon: 2, character: ["P-021", "P-023"].slice(0, count) },
      { character: ["ST02-002", "ST29-003"] },
    );
    e.asSouth().play("P-024");
    expect(e.getView("south").players.south.leader.power).toBe(5000 + 1000 * count);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("Main snapshots Character count before later play", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-024", "ST01-006"],
      activeDon: 3,
      character: ["P-021"],
    });
    e.asSouth().play("P-024");
    e.asSouth().play("ST01-006");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
  });
  test.each(["leader", "character"])("Trigger gives1000 to chosen%s then expires", (kind) => {
    const e = OnePieceTestEngine.create({}, { life: ["P-024", "ST02-002"], character: ["P-027"] });
    const target =
      kind === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "P-027");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets(target);
    expect(
      kind === "leader"
        ? e.getView("north").players.north.leader.power
        : e.getView("north").players.north.characters[0]?.power,
    ).toBe(kind === "leader" ? 6000 : 5000);
    e.asSouth().endTurn();
    expect(
      kind === "leader"
        ? e.getView("north").players.north.leader.power
        : e.getView("north").players.north.characters[0]?.power,
    ).toBe(kind === "leader" ? 5000 : 4000);
  });
  test("declines optional Trigger target with legal recipients", () => {
    const e = OnePieceTestEngine.create({}, { life: ["P-024", "ST02-002"], character: ["P-027"] });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets();
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
  });
});
