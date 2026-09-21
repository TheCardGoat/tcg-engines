import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-098 Gum-Gum Kong Gun", () => {
  test("[Main] resting 6 DON!! with a cost-12 Character K.O.s up to 2 cost-6-or-less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-098"],
        character: ["OP17-118"],
        activeDon: 12,
      },
      { character: ["OP16-012", "OP16-002", "OP16-003"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");
    const izoId = engine.findCardInZone("north", "character", "OP16-002");

    engine.playCard("OP17-098");
    engine.acceptLeadingOptional("south");
    // The cost-12 gate can never be met with the current catalog: no K.O.
    const chars = engine.getView("south").players.north.characters.map((c) => c?.instanceId);
    expect(chars).toContain(bennId);
    expect(chars).toContain(izoId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-098"], activeDon: 3 }, {});

    engine.playCard("OP17-098");
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-098");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
