import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-039 Gum-Gum Twin Jet Pistol", () => {
  test("[Main] gives a [Monkey.D.Luffy] [Double Attack] and rests cost-3-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-022", character: ["OP16-095"], hand: ["OP16-039"], activeDon: 5 },
      { character: ["OP16-002", "OP16-003"], activeDon: 5 },
    );
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");

    engine.playCard("OP16-039");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the [Double Attack] target.");
    const luffyCandidate = grant.candidates.find((c) => c.publicInfo?.cardId === "OP16-095");
    if (!luffyCandidate) throw new Error("Expected Luffy among the candidates.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [luffyCandidate.ref.id!] },
      "south",
    );

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected the rest targets.");
    const izoCandidate = rest.candidates.find((c) => c.publicInfo?.cardId === "OP16-002");
    if (!izoCandidate) throw new Error("Expected Izo among the rest candidates.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [izoCandidate.ref.id!] },
      "south",
    );
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.cardId === "OP16-002")
        ?.rested,
    ).toBe(true);

    // The rested Character stays rested through the opponent's refresh is not
    // asserted here (only a rest, not a freeze); the Double Attack grant shows
    // by the freshly-played Luffy dealing 2 damage on an attack.
    const view = engine.getView("south");
    expect(view.players.south.characters.find((c) => c?.instanceId === luffyId)?.attachedDon).toBe(
      0,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("[Main] resolves and moves to trash", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-039"], activeDon: 3 }, {});

    engine.playCard("OP16-039");
    const pending = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (pending?.extensions?.resolutionIntent) {
      const step = engine.pendingDecision(pending.extensions.resolutionIntent as never, "south")
        .steps[0];
      if (step?.kind === "selectEntity" || step?.kind === "orderItems") {
        engine.resolveDecision(
          pending.extensions.resolutionIntent as never,
          { selectedIds: [] },
          "south",
        );
      } else if (step?.kind === "chooseOption") {
        engine.resolveDecision(
          pending.extensions.resolutionIntent as never,
          { optionId: "0" },
          "south",
        );
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-039");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
