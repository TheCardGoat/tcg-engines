import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST13-003 Monkey.D.Luffy", () => {
  test("pays a discard at zero Life then adds one cost-five Character from hand and one from trash face-up", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 0,
      hand: ["ST04-005", "ST11-004", "ST04-004"],
      trash: ["ST01-012", "ST02-006"],
    });
    const hand = e.findCardInZone("south", "hand", "ST04-005"),
      trash = e.findCardInZone("south", "trash", "ST01-012"),
      paid = e.findCardInZone("south", "hand", "ST11-004");
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("Life cards");
    expect(p.candidates.map((c) => c.ref.id)).toEqual(expect.arrayContaining([hand, trash]));
    expect(p.candidates).toHaveLength(2);
    e.asSouth().chooseTargets(hand, trash);
    expect(e.getView("north").players.south.life.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([hand, trash]),
    );
    expect(e.getView("north").players.south.life.map((c) => c.cardId)).toEqual(
      expect.arrayContaining(["ST04-005", "ST01-012"]),
    );
    // Face orientation is stored in engine state; the public identities above prove visibility.
    expect([hand, trash].every((id) => e.getState().cards[id]?.faceUp)).toBe(true);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
  });
  test("pays the discard before a nonzero Life count prevents addition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 1,
      hand: ["ST11-004"],
      trash: ["ST04-005"],
    });
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines the discard and leaves zero Life and the hand unchanged", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 0,
      hand: ["ST04-005"],
    });
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().declineOptional();
  });
  test("cannot activate with one attached DON", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 1,
      life: 0,
      hand: ["ST04-005"],
    });
    e.attachDon(e.leader("south"), 1);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("damage bottoms face-up Life without offering its Trigger", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-003",
        life: [{ cardId: "ST05-009", faceUp: true, publicKnowledge: true }],
        deck: 5,
      },
      { character: [{ cardId: "ST04-012", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const life = e.findCardInZone("south", "life", "ST05-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-012"), e.leader("south"));
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getState().players.south.deck.at(-1)).toBe(life);
  });
  test("may choose zero Life cards after paying with an eligible Character", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-003",
      activeDon: 2,
      life: 0,
      hand: ["ST04-005"],
    });
    const paid = e.findCardInZone("south", "hand", "ST04-005");
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("Life choice");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([paid]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
