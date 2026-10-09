import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST19-003 Tashigi", () => {
  test("Smoker enables minus four then exact zero trash without OnKO", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-093", hand: ["ST19-003"], activeDon: 5 },
      { character: ["OP01-080", "ST02-013"], deck: 10 },
    );
    const target = e.findCardInZone("north", "character", "OP01-080");
    e.asSouth().play("ST19-003");
    e.asSouth().chooseTargets(target);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === target)?.cost,
    ).toBe(0);
    const t = e.findCardInZone("south", "character", "ST19-003");
    e.asSouth().activateMain(t);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: t,
      trigger: "activateMain",
    });
  });
  test("wrong Leader skips OnPlay but may trash a zero-cost Character on played turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST19-003", "OP02-117"], activeDon: 6 },
      { character: ["ST02-012", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-012");
    e.asSouth().play("ST19-003");
    expect(e.getView("south").prompts).toHaveLength(0);
    e.asSouth().play("OP02-117");
    e.asSouth().chooseTargets(target);
    const t = e.findCardInZone("south", "character", "ST19-003");
    e.asSouth().activateMain(t);
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: t,
      trigger: "activateMain",
    });
  });
  test("may decline zero-cost trash and OnPlay reduction expires", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP02-093", hand: ["ST19-003"], activeDon: 5 },
      { character: ["ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST02-006");
    e.asSouth().play("ST19-003");
    e.asSouth().chooseTargets(target);
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST19-003"));
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(0);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(4);
  });
});
