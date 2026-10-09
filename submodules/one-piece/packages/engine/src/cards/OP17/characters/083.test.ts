import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-083", () => {
  test("without a cost-twelve Character, Jinbe has neither Blocker nor the power bonus", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST06-001",
        hand: ["OP17-083"],
        activeDon: 2,
        life: ["ST06-004", "ST06-008"],
      },
      { leaderCardId: "ST01-001", hand: [], deck: ["ST01-004", "ST01-005"] },
    );
    e.asSouth().play("OP17-083");
    const jinbe = e.findCardInZone("south", "character", "OP17-083");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
    e.endTurn("south");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    const view = e.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.characters[0]?.instanceId).toBe(jinbe);
    expect(view.players.south.characters[0]?.rested).toBe(false);
    expect(view.players.south.characters[0]?.power).toBe(2000);
  });

  test("an opposing cost-twelve Character enables Blocker and the power to survive a 3000 attack", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", character: ["OP17-083"], hand: [] },
      {
        leaderCardId: "OP05-001",
        character: ["OP17-089", { cardId: "EB01-005", playedOnTurn: 0 }],
      },
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack("EB01-005", e.leader("south"));
    e.resolveDecision(
      "battleBlocker",
      { selectedIds: [e.findCardInZone("south", "character", "OP17-083")] },
      "south",
    );
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });
});
