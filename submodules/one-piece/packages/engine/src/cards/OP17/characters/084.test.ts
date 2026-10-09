import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-084 Tony Tony.Chopper", () => {
  test("without a cost-twelve Character, On Play does not bypass an opposing Blocker", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP04-020",
        hand: ["OP17-084"],
        character: [{ cardId: "EB01-018", playedOnTurn: 0 }],
        activeDon: 1,
      },
      { leaderCardId: "ST01-001", character: ["ST01-006"], hand: [] },
    );
    e.asSouth().play("OP17-084");
    expect(e.getView("south").prompts).toHaveLength(0);
    const life = e.getView("south").players.north.lifeCount;
    const blocker = e.findCardInZone("north", "character", "ST01-006");
    e.asSouth().attack("EB01-018", e.leader("north"));
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("south").players.north.lifeCount).toBe(life);
    expect(e.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      blocker,
    );
  });

  test("granted Unblockable bypasses a real opposing Blocker and expires next turn", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP04-020",
        deck: ["ST06-008", "ST06-004"],
        hand: ["OP17-084"],
        character: [{ cardId: "EB01-018", playedOnTurn: 0 }],
        activeDon: 1,
      },
      {
        leaderCardId: "OP05-001",
        character: ["OP17-089", "ST01-006"],
        hand: [],
        life: ["ST01-004", "ST01-005"],
        deck: ["ST01-004", "ST01-005"],
      },
    );
    const attacker = e.findCardInZone("south", "character", "EB01-018");
    e.asSouth().play("OP17-084");
    e.resolveDecision("effectTargetSelection", { selectedIds: [attacker] }, "south");
    const life = e.getView("south").players.north.lifeCount;
    e.asSouth().attack(attacker, e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.cardId === "ST01-006")?.rested,
    ).toBe(false);
    e.endTurn("south");
    e.endTurn("north");
    const blocker = e.findCardInZone("north", "character", "ST01-006");
    e.asSouth().attack(attacker, e.leader("north"));
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("south").players.north.lifeCount).toBe(life - 1);
    expect(e.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      blocker,
    );
  });
});
