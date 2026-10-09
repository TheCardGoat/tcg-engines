import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-011 Whitey Bay", () => {
  test("reveals two included-type hand cards without discarding and buffs Leader this turn", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["ST22-011", "OP01-033", "ST15-001", "ST22-009", "ST02-002"],
      activeDon: 1,
    });
    const a = e.findCardInZone("south", "hand", "OP01-033"),
      b = e.findCardInZone("south", "hand", "ST15-001"),
      wrong = e.findCardInZone("south", "hand", "ST02-002");
    e.asSouth().play("ST22-011");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("reveal");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(wrong);
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: [a, b] }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(
      e
        .getView("north")
        .logs.some(
          (l) =>
            l.message.includes("reveals") &&
            l.message.includes("Izo") &&
            l.message.includes("Atmos"),
        ),
    ).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(4);
    expect(e.getView("south").players.south.leader.power).toBe(7000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("declines optional reveal and keeps Leader power", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["ST22-011", "OP01-033", "ST15-001"],
      activeDon: 1,
    });
    e.asSouth().play("ST22-011");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("wrong Leader can pay reveal but cannot receive power", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST22-011", "OP01-033", "ST15-001"],
      activeDon: 1,
    });
    e.asSouth().play("ST22-011");
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("one qualifying hand card cannot pay reveal two", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST22-001",
      hand: ["ST22-011", "OP01-033", "ST02-002"],
      activeDon: 1,
    });
    e.asSouth().play("ST22-011");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("opponent-turn Alvida play does not offer reveal despite two qualifying cards", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP09-042",
        character: [{ cardId: "OP09-043", rested: true }],
        hand: ["ST22-011", "OP01-033", "ST15-001"],
      },
      { hand: ["OP04-038"], activeDon: 5 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const a = e.findCardInZone("south", "character", "OP09-043"),
      w = e.findCardInZone("south", "hand", "ST22-011");
    e.asNorth().play("OP04-038");
    e.asNorth().chooseTargets();
    e.asNorth().chooseTargets(a);
    e.asSouth().choosePlay(w);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === w)).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(
      e
        .getView("north")
        .logs.some(
          (l) =>
            l.sourceInstanceId === w &&
            l.message.includes("reveals") &&
            l.message.includes("from hand"),
        ),
    ).toBe(false);
    expect(e.getView("north").players.south.hand.every((card) => card.name === null)).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
