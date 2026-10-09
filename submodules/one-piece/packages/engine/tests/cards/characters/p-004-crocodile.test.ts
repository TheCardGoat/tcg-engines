import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P004 Crocodile", () => {
  test.each([0, 1])("DON%s controls Blocker availability", (don) => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "P-004", attachedDon: don }], life: 3 },
    );
    const id = e.findCardInZone("north", "character", "P-004");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    if (don) e.asNorth().chooseBlocker(id);
    expect(e.getView("north").players.north.lifeCount).toBe(don ? 3 : 2);
    expect(
      e
        .getView("north")
        .players.north.trash.map((c) => c.instanceId)
        .includes(id),
    ).toBe(Boolean(don));
  });
  test("declines optional Blocker with DON condition met", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "P-004", attachedDon: 1 }], life: 3 },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
