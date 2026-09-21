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

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-077"], activeDon: 3 }, {});

    engine.playCard("OP17-077");
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-077");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
