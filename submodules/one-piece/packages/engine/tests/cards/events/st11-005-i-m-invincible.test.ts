import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST11-005 I'm invincible", () => {
  test("readies an Uta Leader for a second attack", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["ST11-005"], activeDon: 3 },
      { life: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().play("ST11-005");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.leader.rested).toBe(false);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("does not ready a Leader with another name", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST11-005"], activeDon: 3 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().play("ST11-005");
    expect(e.getView("south").players.south.leader.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("may choose zero Uta Leaders", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", hand: ["ST11-005"], activeDon: 3 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().play("ST11-005");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.leader.rested).toBe(true);
  });
  test.each(["leader", "character"] as const)(
    "Life Trigger gives the chosen %s 1000 power until turn end",
    (zone) => {
      const e = OnePieceTestEngine.create(
        { life: ["ST11-005"], character: ["ST04-012"] },
        { character: [{ cardId: "ST04-012", playedOnTurn: 0 }] },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const target =
        zone === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "ST04-012");
      const before =
        zone === "leader"
          ? e.getView("south").players.south.leader.power
          : e.getView("south").players.south.characters[0]?.power;
      e.asNorth().attack(e.findCardInZone("north", "character", "ST04-012"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      e.asSouth().chooseTargets(target);
      const after =
        zone === "leader"
          ? e.getView("south").players.south.leader.power
          : e.getView("south").players.south.characters[0]?.power;
      expect(after).toBe((before ?? 0) + 1000);
      e.asNorth().endTurn();
      const expired =
        zone === "leader"
          ? e.getView("south").players.south.leader.power
          : e.getView("south").players.south.characters[0]?.power;
      expect(expired).toBe(before);
    },
  );
});
