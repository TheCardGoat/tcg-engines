import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-049 Charlotte Linlin", () => {
  test.each(["0", "1"])("opponent chooses controller draw or own discard: %s", (option) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-049"], activeDon: 5 },
      { hand: ["EB01-005", "EB01-025"] },
    );
    e.playCard("OP17-049");
    e.pendingDecision("effectActionChoice", "north");
    e.resolveDecision("effectActionChoice", { optionId: option }, "north");
    const view = e.getView("south");
    expect(view.players.south.handCount).toBe(option === "0" ? 2 : 0);
    expect(view.players.north.handCount).toBe(option === "0" ? 2 : 0);
    expect(view.prompts).toHaveLength(0);
  });
  test("opponent-attack bonus expires after the battle and cannot repeat with a payable hand cost", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST03-001",
        character: ["OP17-049"],
        hand: ["EB01-025", "ST03-004"],
        life: ["ST03-004", "ST03-004", "ST03-004"],
      },
      { leaderCardId: "ST01-001", character: [{ cardId: "ST01-005", playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const payment = e.findCardInZone("south", "hand", "EB01-025"),
      retained = e.findCardInZone("south", "hand", "ST03-004");
    e.asNorth().attack(e.asNorth().leader(), e.asSouth().leader());
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [payment] }, "south");
    e.asSouth().chooseTargets(e.asSouth().leader());
    e.pendingDecision("battleCounter", "south");
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual([
      retained,
    ]);
    expect(e.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual([
      payment,
    ]);

    e.asNorth().attack("ST01-005", e.asSouth().leader());
    // A Counter choice, rather than another optional trigger, proves the
    // once-per-turn gate with a card still available to pay its hand cost.
    e.pendingDecision("battleCounter", "south");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual([
      retained,
    ]);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual([
      payment,
    ]);
  });

  test("declines the payable opponent-attack cost and receives no battle power", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST03-001",
        character: ["OP17-049"],
        hand: ["EB01-025"],
        life: ["ST03-004", "ST03-004"],
      },
      { leaderCardId: "ST01-001" },
      { activeSeat: "north" },
    );
    const retained = e.findCardInZone("south", "hand", "EB01-025");
    e.asNorth().attack(e.asNorth().leader(), e.asSouth().leader());
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((card) => card.instanceId)).toEqual([
      retained,
    ]);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    e.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      retained,
    );
  });
});
