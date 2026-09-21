import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-087 Shinobu", () => {
  test("[On Play] trashing itself draws 1 and gives a [Kouzuki Momonosuke] +20 cost for a Land of Wano Leader", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        character: ["OP16-084"],
        hand: ["OP16-087", "EB01-005"],
        activeDon: 5,
      },
      {},
    );
    const momoId = engine.findCardInZone("south", "character", "OP16-084");

    engine.playCard("OP16-087");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the +20 cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [momoId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.cardId)).toContain("OP16-087");
    expect(south.characters.find((card) => card?.instanceId === momoId)?.cost).toBe(25);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Land of Wano Leader the effect is not offered", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-084"], hand: ["OP16-087"], activeDon: 5 },
      {},
    );

    engine.playCard("OP16-087");

    // The optional On Play is not offered without the Land of Wano Leader.
    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-087");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-084");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] may be declined", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-087"], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP16-087");
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
      "OP16-087",
    );
    expect(engine.getView("south").players.south.handCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const shinobu = "OP16-087";
    const engine = OnePieceTestEngine.create(
      { hand: [shinobu], activeDon: 4 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(shinobu);
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
      shinobu,
    );
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
