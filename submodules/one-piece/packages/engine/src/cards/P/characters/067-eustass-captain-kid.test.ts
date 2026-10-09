import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("P-067 Eustass Captain Kid", () => {
  test("active Kid allows Leader attack, but rested Kid without DON!! restricts attacks by name", () => {
    const active = OnePieceTestEngine.create(
      { character: ["P-067"], life: 3 },
      {},
      { activeSeat: "north" },
    );
    active.declareAttack(active.leader("north"), active.leader("south"), "north");
    expect(active.getView("south").players.south.lifeCount).toBe(2);
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-067", rested: true },
          { cardId: "EB01-005", rested: true },
        ],
        life: 3,
      },
      {},
      { activeSeat: "north" },
    );
    const kid = e.findCardInZone("south", "character", "P-067");
    for (const target of [e.leader("south"), e.findCardInZone("south", "character", "EB01-005")]) {
      const failed = e.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: e.leader("north"),
        targetId: target,
      });
      expect(
        OnePieceTestEngine.fromState(failed.state).getView("south").players.north.leader?.rested,
      ).toBe(false);
    }
    e.declareAttack(e.leader("north"), kid, "north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === kid)?.attachedDon,
    ).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.north.leader?.rested).toBe(true);
  });
  test.each(["P-067", "OP17-044"])(
    "official OP17 FAQ: Captain John and Kid allow attack on either named Character: %s",
    (targetCard) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP17-039",
          character: [
            { cardId: "P-067", rested: true },
            { cardId: "OP17-044", rested: true },
            { cardId: "EB01-005", rested: true },
          ],
        },
        {},
        { activeSeat: "north" },
      );
      for (const target of [
        e.leader("south"),
        e.findCardInZone("south", "character", "EB01-005"),
      ]) {
        const failed = e.expectFailure({
          type: "declareAttack",
          seat: "north",
          attackerId: e.leader("north"),
          targetId: target,
        });
        expect(
          OnePieceTestEngine.fromState(failed.state).getView("south").players.north.leader?.rested,
        ).toBe(false);
      }
      e.declareAttack(
        e.leader("north"),
        e.findCardInZone("south", "character", targetCard),
        "north",
      );
      expect(e.getView("south").players.north.leader?.rested).toBe(true);
      expect(e.getView("south").players.south.lifeCount).toBe(5);
    },
  );
  test("restriction permits another rested Character with the same Kid name", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [
          { cardId: "P-067", rested: true },
          { cardId: "ST02-013", rested: true },
        ],
      },
      {},
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.findCardInZone("south", "character", "ST02-013"), "north");
    expect(e.getView("south").players.north.leader?.rested).toBe(true);
  });
});
