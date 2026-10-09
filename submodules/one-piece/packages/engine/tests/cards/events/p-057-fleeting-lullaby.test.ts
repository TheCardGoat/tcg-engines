import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-057 Fleeting Lullaby", () => {
  test.each([0, 1, 2])(
    "freezes %i rested cost-four-or-less Characters through next Refresh",
    (amount) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST11-001", hand: ["P-057"], activeDon: 3 },
        {
          character: [
            { cardId: "ST02-002", rested: true },
            { cardId: "ST02-006", rested: true },
            "ST02-012",
            { cardId: "ST01-012", rested: true },
          ],
        },
      );
      const ids = [
        e.findCardInZone("north", "character", "ST02-002"),
        e.findCardInZone("north", "character", "ST02-006"),
      ];
      e.asSouth().play("P-057");
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("target");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual(ids);
      e.asSouth().chooseTargets(...ids.slice(0, amount));
      e.asSouth().endTurn();
      expect(e.getView("north").players.north.characters.filter((c) => c?.rested)).toHaveLength(
        amount,
      );
      e.asNorth().endTurn();
      e.asSouth().endTurn();
      expect(e.getView("north").players.north.characters.filter((c) => c?.rested)).toHaveLength(0);
    },
  );
  test("wrong Leader does not freeze", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["P-057"], activeDon: 3 },
      { character: [{ cardId: "ST02-002", rested: true }] },
    );
    e.asSouth().play("P-057");
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
  test.each(["ST11-001", "ST01-001"])("Life Trigger repeats Main Leader gate %s", (leader) => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: [{ cardId: "ST02-002", rested: true }] },
      { leaderCardId: leader, life: ["P-057", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST02-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    if (leader === "ST11-001") e.asNorth().chooseTargets(c);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(leader === "ST11-001");
  });
});
