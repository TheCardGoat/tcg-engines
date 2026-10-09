import { describe, expect, test } from "vite-plus/test";

import { op08King057 } from "../../../../../cards/src/cards/leaders/op08-057-king.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-077 Kundali Dragon Swarm", () => {
  test("[Main] with an Animal Kingdom Leader rests DON and hand cards to add 3 rested DON", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08King057,
        hand: ["OP17-077", "EB01-005", "OP16-004", "OP13-013"],
        activeDon: 5,
        donDeckCount: 8,
      },
      {},
    );

    engine.playCard("OP17-077");
    engine.acceptLeadingOptional("south");
    // The rest-3-DON cost auto-resolves; pay the 2-card hand trash.
    const trash = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (trash?.kind !== "payCost") throw new Error("Expected the trash cost.");
    const handIds = engine
      .getView("south")
      .players.south.hand.flatMap((card) => (card.instanceId ? [card.instanceId] : []));
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: handIds.slice(0, 2) },
      "south",
    );
    const add = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the DON add.");
    engine.resolveDecision("effectAddDon", { optionId: "3" }, "south");

    const south = engine.getView("south").players.south;
    // Play cost + rest-3-DON cost + 3 added rested DON!!.
    expect(south.restedDon).toBe(7);
    expect(south.donDeckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("a different Leader pays both Main costs but gains no DON", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP17-077", "EB01-005", "EB01-025"],
      activeDon: 4,
      donDeckCount: 6,
    });
    engine.asSouth().play("OP17-077");
    engine.asSouth().acceptOptional();
    const south = engine.getView("south").players.south;
    expect(south.handCount).toBe(0);
    expect(south.trash.map((c) => c.cardId)).toEqual(["OP17-077", "EB01-005", "EB01-025"]);
    expect(south.activeDon).toBe(0);
    expect(south.restedDon).toBe(4);
    expect(south.donDeckCount).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining Main keeps the activation payment and DON deck unchanged", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08King057,
      hand: ["OP17-077", "EB01-005", "EB01-025"],
      activeDon: 4,
      donDeckCount: 6,
    });
    engine.asSouth().play("OP17-077");
    const before = engine.getView("south").players.south;
    engine.asSouth().declineOptional();
    // No usable Counter remains, so the Counter Step ends automatically.
    const after = engine.getView("south").players.south;
    expect(after.hand).toEqual(before.hand);
    expect(after.trash).toEqual(before.trash);
    expect(after.activeDon).toBe(3);
    expect(after.restedDon).toBe(1);
    expect(after.donDeckCount).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter returns one DON and gives any Leader +4000 for this battle", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-077", "EB01-005"], activeDon: 1, donDeckCount: 9 },
      { character: ["EB01-041"] },
      { activeSeat: "north" },
    );
    const before = engine.getView("south").players.south;
    engine.asNorth().attack("EB01-041", engine.leader("south"));
    engine.asSouth().chooseCounter("OP17-077");
    engine.asSouth().acceptOptional();
    const during = engine.getView("south").players.south;
    expect(
      engine
        .getView("south")
        .logs.some(
          (entry) =>
            entry.sourceCardId === "OP17-077" &&
            entry.targetIds.includes(engine.leader("south")) &&
            entry.message.includes("+4000 power this battle"),
        ),
    ).toBe(true);
    expect(during.donDeckCount).toBe(10);
    expect(during.activeDon + during.restedDon).toBe(0);
    engine.asSouth().chooseCounter();
    const after = engine.getView("south").players.south;
    expect(after.lifeCount).toBe(before.lifeCount);
    expect(after.leader.power).toBe(before.leader.power);
  });

  test("declines the Counter DON return after paying the Event play cost", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-077"], activeDon: 4, life: 3 },
      { character: [{ cardId: "ST05-011", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const event = e.findCardInZone("south", "hand", "OP17-077");
    const before = e.getView("south").players.south;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST05-011"), e.leader("south"));
    e.asSouth().chooseCounter("OP17-077");
    e.asSouth().declineOptional();
    const after = e.getView("south").players.south;
    expect(after.activeDon).toBe(3);
    expect(after.restedDon).toBe(1);
    expect(after.donDeckCount).toBe(before.donDeckCount);
    expect(after.deckCount).toBe(before.deckCount);
    expect(after.lifeCount).toBe(before.lifeCount - 1);
    expect(after.trash.map((c) => c.instanceId)).toContain(event);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
