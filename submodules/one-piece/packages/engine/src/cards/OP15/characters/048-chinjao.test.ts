import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01ConquererOfThreeWorldsRagnaraku039, op02IceAge117 } from "@tcg/op-cards";
import { op15Chinjao048 } from "../../../../../cards/src/cards/characters/op15-048-chinjao.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-048 Chinjao", () => {
  test("[On Play] trashes an Event to draw 2 cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Chinjao048, op02IceAge117],
        activeDon: 5,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {},
    );
    const eventId = engine.findCardInZone("south", "hand", op02IceAge117);

    engine.playCard("OP15-048");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone Event in hand is trashed automatically.

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      eventId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] on the opponent's turn returns one of their hand cards to the deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Chinjao048], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039, op02IceAge117], activeDon: 5, restedDon: 1 },
    );
    const chinjaoId = engine.findCardInZone("south", "character", op15Chinjao048);

    engine.endTurn("south");
    const northDeckBefore = engine.getView("south").players.north.deckCount;
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [chinjaoId] }, "north");

    // North (the hand's owner) picks which card goes to the deck bottom
    // through the opaque follow-up target prompt.
    const returnedId = engine.getView("north").players.north.hand[0]!.instanceId!;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "north");

    const north = engine.getView("south").players.north;
    expect(north.handCount).toBe(1);
    expect(north.deckCount).toBe(northDeckBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-048"], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-048");
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-048",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const chinjao = "OP15-048";
    const engine = OnePieceTestEngine.create(
      { hand: [chinjao], activeDon: 6 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(chinjao);
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

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      chinjao,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
