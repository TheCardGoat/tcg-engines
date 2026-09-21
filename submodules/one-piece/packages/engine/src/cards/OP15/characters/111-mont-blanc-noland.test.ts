import { describe, expect, test } from "vite-plus/test";
import { op08Kalgara099 } from "../../../../../cards/src/cards/characters/op08-099-kalgara.ts";
import { op15MontBlancNoland111 } from "../../../../../cards/src/cards/characters/op15-111-mont-blanc-noland.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-111 Mont Blanc Noland", () => {
  test("[DON!! x1] [When Attacking] grants Rush to a Kalgara card for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15MontBlancNoland111, op08Kalgara099], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const nolandId = engine.findCardInZone("south", "character", op15MontBlancNoland111);
    const kalgaraId = engine.findCardInZone("south", "character", op08Kalgara099);

    engine.attachDon(nolandId, 1, "south");
    engine.declareAttack(nolandId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the Rush target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([kalgaraId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kalgaraId] }, "south");

    // The Kalgara Character was not played this turn; attacking proves Rush.
    engine.declareAttack(kalgaraId, engine.leader("north"), "south");
  });

  test("without a DON!! attached no Rush is granted and Kalgara cannot attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15MontBlancNoland111, op08Kalgara099], activeDon: 6 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", op15MontBlancNoland111),
      engine.leader("north"),
      "south",
    );
    // No DON!! attached: the [When Attacking] grant never opens.
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    expect(gate?.extensions?.resolutionIntent === "effectTargetSelection").toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
