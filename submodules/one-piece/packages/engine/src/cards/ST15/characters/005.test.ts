import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("ST15-005 Portgas.D.Ace", () => {
  test("Whitebeard Leader grants Rush to a freshly played Ace", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-001", hand: ["ST15-005"], activeDon: 5 },
      {},
    );
    e.playCard("ST15-005");
    const before = e.getView("south").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST15-005"), e.leader("north"));
    expect(e.getView("south").players.north.lifeCount).toBe(before - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("other Leaders do not grant Rush", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["ST15-005"], activeDon: 5 },
      {},
    );
    e.playCard("ST15-005");
    const failure = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: e.findCardInZone("south", "character", "ST15-005"),
      targetId: e.leader("north"),
    });
    expect(failure.reason).toContain("cannot attack");
  });
  test("replaces only its own removal and only once during a turn", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-005"] },
      { hand: ["ST01-015", "ST01-015"], activeDon: 8 },
      { activeSeat: "north" },
    );
    const ace = e.findCardInZone("south", "character", "ST15-005");
    e.playCard("ST01-015", "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [ace] }, "north");
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    e.playCard("ST01-015", "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [ace] }, "north");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(ace);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("does not replace removal of another Character", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST15-005", "EB01-005"] },
      { hand: ["ST01-015"], activeDon: 4 },
      { activeSeat: "north" },
    );
    const doma = e.findCardInZone("south", "character", "EB01-005");
    e.playCard("ST01-015", "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [doma] }, "north");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(doma);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
