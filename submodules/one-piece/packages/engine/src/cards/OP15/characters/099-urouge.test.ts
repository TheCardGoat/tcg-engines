import { describe, expect, test } from "vite-plus/test";
import { eb01Cavendish012 } from "../../../../../cards/src/cards/characters/eb01-012-cavendish.ts";
import { op15Urouge099 } from "../../../../../cards/src/cards/characters/op15-099-urouge.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-099 Urouge", () => {
  test("[On Play] trashes a Supernovas card to gain Rush and attacks immediately", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Urouge099, eb01Cavendish012], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard("OP15-099");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const urougeId = engine.findCardInZone("south", "character", op15Urouge099);

    // Rush lets the just-played Urouge attack immediately.
    engine.declareAttack(urougeId, engine.leader("north"), "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      "EB01-012",
    );
  });

  test("[Activate: Main] turns a Life card face-up to give a rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Urouge099], activeDon: 4, restedDon: 1 },
      {},
    );
    const urougeId = engine.findCardInZone("south", "character", op15Urouge099);
    const leaderId = engine.leader("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.activateEffect(urougeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(leaderId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.restedDon).toBe(0);
    expect(south.leader?.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-099"], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP15-099");
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
      "OP15-099",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const urouge = "OP15-099";
    const engine = OnePieceTestEngine.create(
      { hand: [urouge], activeDon: 8 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(urouge);
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
      urouge,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
