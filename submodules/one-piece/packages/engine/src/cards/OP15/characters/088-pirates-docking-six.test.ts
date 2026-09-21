import { describe, expect, test } from "vite-plus/test";
import { op15RoronoaZoro094 } from "../../../../../cards/src/cards/characters/op15-094-roronoa-zoro.ts";
import { op15PiratesDockingSix088 } from "../../../../../cards/src/cards/characters/op15-088-pirates-docking-six.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-088 Pirates Docking Six", () => {
  test("[On Play] trashes 3 deck cards to replay a Straw Hat Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15PiratesDockingSix088],
        trash: [op15RoronoaZoro094],
        activeDon: 12,
        deck: 6,
      },
      {},
    );
    const zoroId = engine.findCardInZone("south", "trash", op15RoronoaZoro094);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard("OP15-088");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([zoroId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [zoroId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === zoroId)).toBe(true);
    expect(south.deckCount).toBe(deckBefore - 3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("costs 11 with the +6 cost modifier", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15PiratesDockingSix088], activeDon: 11 },
      {},
    );

    engine.playCard("OP15-088");

    expect(engine.getView("south").players.south.activeDon).toBe(0);
  });

  test("[On Play] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-088"], activeDon: 12 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-088");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-088",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const docking = "OP15-088";
    const engine = OnePieceTestEngine.create(
      { hand: [docking], activeDon: 12 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(docking);
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
      docking,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
