import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST19-005 Garp", () => {
  test("trash bottom cost gives minus one until turn end once", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST19-005"], trash: ["ST02-002"] },
      { character: ["ST02-006"] },
    );
    const g = e.findCardInZone("south", "character", "ST19-005"),
      paid = e.findCardInZone("south", "trash", "ST02-002");
    e.asSouth().activateMain(g);
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST02-006"));
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(3);
    expect(e.getState().players.south.deck.at(-1)).toBe(paid);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: g,
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(4);
  });
  test("declines optional payment leaving trash and opposing cost unchanged", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST19-005"], trash: ["ST02-002"] },
      { character: ["ST02-006"] },
    );
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST19-005"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.trash).toHaveLength(1);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(4);
  });
  test("empty trash cannot pay", () => {
    const e = OnePieceTestEngine.create({ character: ["ST19-005"] });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST19-005"),
      trigger: "activateMain",
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Blocker intercepts battle and protects Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST19-005"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const g = e.findCardInZone("south", "character", "ST19-005");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseBlocker(g);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(g);
  });
  test("declines Blocker and takes Leader damage", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST19-005"], life: 2 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST19-005");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      instanceId: c,
      rested: false,
    });
  });
});
