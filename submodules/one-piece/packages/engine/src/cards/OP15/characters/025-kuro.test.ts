import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op15Kuro025 } from "../../../../../cards/src/cards/characters/op15-025-kuro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-025 Kuro", () => {
  test("Blocker redirects an opposing Leader attack away from Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Kuro025], hand: [], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op15Kuro025);
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may choose an own rested Character but does not freeze that card at its owner's next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op15Kuro025],
        activeDon: 7,
        character: [{ card: eb01Doma005, rested: true, attachedDon: 3 }],
      },
      { character: [eb01Doma005], activeDon: 1 },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(op15Kuro025, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    engine.endTurn("south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected delayed Character selection.");
    expect(choice.candidates.map((card) => card.ref.id)).toContain(ownId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === ownId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] moves cost-area DON!! and freezes the fed Character at the next refresh", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Kuro025], activeDon: 7 },
      {
        character: [
          { card: eb01Doma005, rested: true, attachedDon: 1 },
          { card: eb01Fourtricks025, rested: true },
        ],
        activeDon: 2,
        restedDon: 1,
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const fourtricksId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op15Kuro025);

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the cost-area DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");
    engine.resolveDecision("effectGiveDonSource", { optionId: "1" }, "south");

    const northBefore = engine.getView("south").players.north;
    expect(northBefore.restedDon).toBe(0);
    expect(northBefore.activeDon).toBe(1);
    expect(northBefore.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(3);

    engine.endTurn("south");

    // The deferred end-of-turn freeze choice pauses before the refresh.
    const freeze = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (freeze?.kind !== "selectEntity") throw new Error("Expected the freeze choice.");
    expect(freeze.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const northAfter = engine.getView("south").players.north;
    expect(northAfter.characters.find((card) => card?.instanceId === domaId)?.rested).toBe(true);
    expect(northAfter.characters.find((card) => card?.instanceId === fourtricksId)?.rested).toBe(
      false,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
