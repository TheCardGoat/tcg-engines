import { describe, expect, test } from "vite-plus/test";
import { op17BasilHawkins073, op17Sasaki068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-073 Basil Hawkins", () => {
  test("under an {Animal Kingdom Pirates} Leader trashing a hand card adds an active DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-061",
        hand: [op17BasilHawkins073, "OP16-039"],
        activeDon: op17BasilHawkins073.cost,
        donDeckCount: 3,
      },
      {},
    );
    const fodderId = engine.findCardInZone("south", "hand", "OP16-039");

    engine.playCard(op17BasilHawkins073, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // With a single hand card the trash cost auto-pays; the DON!! grant
    // still asks how many to add.
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south").players.south;
    // playCard consumed Hawkins' 3 DON!!; the effect added 1 active DON!!.
    expect(view.activeDon).toBe(1);
    expect(view.donDeckCount).toBe(2);
    expect(view.trash.map((card) => card.instanceId)).toContain(fodderId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the trash adds nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-061",
        hand: [op17BasilHawkins073, "OP16-039"],
        activeDon: op17BasilHawkins073.cost,
        donDeckCount: 3,
      },
      {},
    );

    engine.playCard(op17BasilHawkins073, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.donDeckCount).toBe(3);
    expect(view.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("never opens under a different Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        hand: [op17BasilHawkins073, "OP16-039"],
        activeDon: op17BasilHawkins073.cost,
        donDeckCount: 3,
      },
      {},
    );

    engine.playCard(op17BasilHawkins073, "south");

    const view = engine.getView("south").players.south;
    expect(view.donDeckCount).toBe(3);
    expect(view.trash).toHaveLength(0);
    expect(view.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});

describe("OP17-068 Sasaki", () => {
  test("trashing 2 hand cards on attack adds 2 rested DON!! under an {Animal Kingdom Pirates} Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-061",
        character: [{ card: op17Sasaki068, playedOnTurn: 0 }],
        hand: ["OP16-039", "OP16-038", "OP16-037"],
        activeDon: 3,
        donDeckCount: 4,
      },
      {},
    );
    const sasakiId = engine.findCardInZone("south", "character", op17Sasaki068);

    engine.declareAttack(sasakiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected the 2-card trash cost.");
    expect(payment.candidates).toHaveLength(3);
    engine.resolveDecision(
      "effectCostTrashFromHand",
      {
        selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id),
      },
      "south",
    );
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.restedDon).toBe(2);
    expect(view.donDeckCount).toBe(2);
    expect(view.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
