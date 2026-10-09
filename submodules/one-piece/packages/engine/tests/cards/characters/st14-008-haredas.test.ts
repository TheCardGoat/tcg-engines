import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-008 Haredas", () => {
  test("new cost-eight threshold draws then trashes after paid self-rest", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST14-008", "ST14-013"],
      hand: ["ST12-009"],
      deck: ["ST12-015", "ST12-004"],
    });
    const source = e.findCardInZone("south", "character", "ST14-008"),
      target = e.findCardInZone("south", "character", "ST14-013"),
      draw = e.findCardInZone("south", "deck", "ST12-015");
    e.activateEffect(source, "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(draw);
    e.asSouth().trashFromHand(draw);
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(8);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(draw);
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(8);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
  });
  test("declines optional self-rest without drawing or increasing cost", () => {
    const e = OnePieceTestEngine.create({ character: ["ST14-008", "ST14-013"], deck: 5 });
    e.activateEffect(e.findCardInZone("south", "character", "ST14-008"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
    expect(e.getView("south").players.south.deckCount).toBe(5);
  });
  test("paid cost increase below eight does not draw or trash", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST14-008", "ST14-005"],
      hand: ["ST12-009"],
      deck: 5,
    });
    e.activateEffect(e.findCardInZone("south", "character", "ST14-008"), "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("south", "character", "ST14-005"));
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(5);
  });
});
