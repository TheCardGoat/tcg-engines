import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Sasaki101 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-101 Sasaki", () => {
  test("with DON!! attached trashes the chosen hand card to add up to one rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Sasaki101, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Fourtricks025],
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sasakiId = engine.findCardInZone("south", "character", op01Sasaki101);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(sasakiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Sasaki's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Sasaki's DON!! count.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!! publishes no effect choice when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Sasaki101, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sasakiId = engine.findCardInZone("south", "character", op01Sasaki101);

    engine.declareAttack(sasakiId, engine.leader("north"), "south");

    expect(engine.getView("south").players.south).toMatchObject({
      handCount: 1,
      restedDon: 0,
      donDeckCount: 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
