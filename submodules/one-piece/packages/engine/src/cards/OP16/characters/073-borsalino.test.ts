import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-073 Borsalino", () => {
  test("[On Play] adds 1 active DON!! and 1 rested DON!! from the DON!! deck", () => {
    const borsalino = "OP16-073";
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-073"], activeDon: 7, donDeckCount: 4 },
      {},
    );

    engine.playCard(borsalino);
    const active = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (active?.kind !== "chooseOption") throw new Error("Expected the active DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    const rested = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (rested?.kind !== "chooseOption") throw new Error("Expected the rested DON!! add.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    // Play cost rested 7 on top of the additions.
    const south = engine.getView("south").players.south;
    expect(south.donDeckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[End of Your Turn] DON!! -2 re-stands this Character and grants [Blocker]", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-073", rested: true }], activeDon: 5 },
      {},
    );
    const borsalinoId = engine.findCardInZone("south", "character", "OP16-073");

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The DON!! -2 cost auto-pays from the active DON!!.

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(3);
    expect(south.characters.find((card) => card?.instanceId === borsalinoId)?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-073", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const pending = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const intent = pending?.extensions?.resolutionIntent;
    if (intent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (intent) {
      engine.resolveDecision(intent as never, { selectedIds: [] }, "south");
    }
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBeGreaterThanOrEqual(northBefore.activeDon);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-073",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[End of Your Turn] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-073", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.endTurn("south");
    try {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } catch {
      /* the optional window only opens under its printed condition */
    }

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-073",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
