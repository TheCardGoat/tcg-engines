import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-056 Rocks Pirates", () => {
  test("Counter does not grant power without its printed eligibility", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP17-056"], character: [], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const before = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP17-056")] },
      "south",
    );
    expect(e.getView("south").players.south.lifeCount).toBe(before - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter executes the printed power bonus through battle", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", hand: ["OP17-056"], character: [], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const lifeBefore = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP17-056")] },
      "south",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-056");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] resting 5 DON!! returns a cost-6-or-less Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-056"], activeDon: 5 },
      { character: ["OP16-002"], activeDon: 5 },
    );

    engine.playCard("OP17-056");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    const izoCandidate = target.candidates.find((c) => c.publicInfo?.cardId === "OP16-002");
    if (!izoCandidate) throw new Error("Expected Izo as a candidate.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [izoCandidate.ref.id!] },
      "south",
    );

    const northHandIds = engine
      .getState()
      .players.north.hand.map((instanceId) => engine.getState().cards[instanceId]?.cardId);
    expect(northHandIds).toContain("OP16-002");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-056"], activeDon: 3 }, {});

    engine.playCard("OP17-056");
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-056");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
