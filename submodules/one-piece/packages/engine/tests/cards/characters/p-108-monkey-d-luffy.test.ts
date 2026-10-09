import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-108 Monkey.D.Luffy", () => {
  test("Blocker intercepts and On KO activates exactly two rested DON", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-108"], restedDon: 3, life: 3 });
    const id = e.findCardInZone("north", "character", "P-108");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(id);
    e.resolveDecision("effectSetActiveDon", { optionId: "2" }, "north");
    expect(e.getView("north").players.north).toMatchObject({
      activeDon: 2,
      restedDon: 1,
      lifeCount: 3,
    });
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines optional Blocker and keeps DON rested", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-108"], restedDon: 3, life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north).toMatchObject({
      activeDon: 0,
      restedDon: 3,
      lifeCount: 2,
    });
  });
  test("declines optional On KO DON activation", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "P-108", rested: true }], restedDon: 1 },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "P-108"));
    e.resolveDecision("effectSetActiveDon", { optionId: "0" }, "north");
    expect(e.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
  });
  test("On KO activates the sole available rested DON", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "P-108", rested: true }], restedDon: 1 },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "P-108"));
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "north");
    expect(e.getView("north").players.north).toMatchObject({ activeDon: 1, restedDon: 0 });
  });
});
