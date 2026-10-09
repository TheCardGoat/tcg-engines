import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST33-004 Borsalino", () => {
  test("normal effect discard allows newly drawn Borsalino paid play at three, then printed field cost remains six", () => {
    let e = OnePieceTestEngine.create({
      leaderCardId: "ST29-001",
      life: 2,
      hand: ["ST02-002"],
      deck: ["ST33-004", "ST02-006"],
      activeDon: 3,
    });
    const paid = e.findCardInZone("south", "hand", "ST02-002"),
      borsa = e.findCardInZone("south", "deck", "ST33-004");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.hand.find((c) => c.instanceId === borsa)?.cost).toBe(3);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.asSouth().play("ST33-004");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(borsa);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(6);
  });
  test("opponent effect hand discard lowers hand cost only for that turn", () => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST33-004", "ST02-002", "ST02-002", "ST02-002", "ST02-002", "ST02-002"],
        activeDon: 6,
        donDeckCount: 0,
      },
      { character: ["ST33-002"], hand: ["ST02-002"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const paid = e
      .getView("south")
      .players.south.hand.find((c) => c.cardId === "ST02-002")!.instanceId!;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST33-002"), e.leader("south"));
    e.asNorth().acceptOptional();
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(
      3,
    );
    e.asSouth().chooseCounter();
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.hand.find((c) => c.cardId === "ST33-004")?.cost).toBe(
      6,
    );
    e.asSouth().play("ST33-004");
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("Blocker intercepts actual attack", () => {
    const e = OnePieceTestEngine.create({}, { character: ["ST33-004"], life: 3 });
    const target = e.findCardInZone("north", "character", "ST33-004");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(target);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create({}, { character: ["ST33-004"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
