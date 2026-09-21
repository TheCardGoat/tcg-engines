import { describe, expect, test } from "vite-plus/test";

import { op08King057 } from "../../../../../cards/src/cards/leaders/op08-057-king.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-078 Drunken Dragon Bagua", () => {
  test("[Main] resting 2 DON!! and trashing 2 cards adds 3 rested DON", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08King057,
        hand: ["OP17-078", "EB01-005", "OP16-004", "OP13-013"],
        activeDon: 6,
        donDeckCount: 8,
      },
      {},
    );

    engine.playCard("OP17-078");
    engine.acceptLeadingOptional("south");
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
    expect(south.restedDon).toBe(7);
    expect(south.donDeckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] saves the Leader with +4000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08King057,
        hand: ["OP17-078"],
        activeDon: 5,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-078");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
