import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P002 Adventure", () => {
  test.each([0, 2])("Main shuffles remaining hand%s and draws same count", (count) => {
    const e = OnePieceTestEngine.create({
      hand: ["P-002", ...["ST02-002", "ST02-006"].slice(0, count)],
      activeDon: 1,
      deck: ["ST02-012", "ST01-006", "ST29-010"],
    });
    const original = e
      .getView("south")
      .players.south.hand.filter((c) => c.cardId !== "P-002")
      .map((c) => c.instanceId!);
    const universe = [...e.getState().players.south.deck, ...original];
    e.asSouth().play("P-002");
    expect(e.getView("south").players.south.handCount).toBe(count);
    expect(e.getView("south").players.south.deckCount).toBe(3);
    expect(
      [
        ...e.getState().players.south.deck,
        ...e.getView("south").players.south.hand.map((c) => c.instanceId!),
      ].sort(),
    ).toEqual(universe.sort());
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["P-002"]);
    expect(e.getView("south").logs.some((l) => l.message.includes("shuffles their deck"))).toBe(
      true,
    );
  });
  test("Life Trigger activates Main using damaged player's hand without paying Event cost", () => {
    const e = OnePieceTestEngine.create(
      {},
      {
        life: ["P-002", "ST02-002"],
        hand: ["ST02-006", "ST02-012"],
        activeDon: 0,
        deck: ["ST29-010", "ST29-006", "ST01-006"],
      },
    );
    const original = e.getState().players.north.hand.slice(),
      life = e.findCardInZone("north", "life", "P-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseCounter();
    e.asNorth().activateLifeTrigger();
    expect(e.getView("north").players.north.handCount).toBe(2);
    expect(e.getView("north").players.north.deckCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(life);
    expect(e.getView("north").players.north.activeDon).toBe(0);
    expect(
      original.every(
        (id) =>
          e.getState().players.north.deck.includes(id) ||
          e.getView("north").players.north.hand.some((c) => c.instanceId === id),
      ),
    ).toBe(true);
  });
});
