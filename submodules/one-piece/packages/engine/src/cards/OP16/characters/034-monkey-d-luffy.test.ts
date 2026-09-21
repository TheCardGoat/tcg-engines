import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-034 Monkey.D.Luffy", () => {
  test("[DON!! x1] [Your Turn] gains +1000 power per differently-named own Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-034", attachedDon: 1 }, "EB01-005", "OP16-004"],
      },
      {},
    );
    const luffyId = engine.findCardInZone("south", "character", "OP16-034");
    // Three distinct names on the board: +3000 on base 0.
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.power,
    ).toBe(4000);
  });

  test("on the opponent's turn the bonus does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-034" }, "EB01-005", "OP16-004"], activeDon: 5 },
      {},
    );
    const luffyId = engine.findCardInZone("south", "character", "OP16-034");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.power,
    ).toBe(0);

    engine.attachDon(engine.findCardInZone("south", "character", "OP16-034"), 1, "south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.power,
    ).toBe(4000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.power,
    ).toBe(0);
  });

  test("[On Play] looks at 3 and may take an Impel Down card to hand, ordering the rest to the bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-034"],
        deck: ["OP16-024", "OP13-013", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-034");

    const reveal = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected the reveal choice.");
    const inazuma = reveal.candidates.find(
      (candidate) => candidate.publicInfo?.cardId === "OP16-024",
    );
    if (!inazuma?.legal) throw new Error("Expected an eligible Impel Down card.");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [inazuma.ref.id!] }, "south");

    const order = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected the remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: order.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-024",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
