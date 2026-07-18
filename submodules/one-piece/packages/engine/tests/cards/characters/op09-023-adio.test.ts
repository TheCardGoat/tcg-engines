import { describe, expect, test } from "vite-plus/test";
import { op09Adio023, op09Lim022, op09Yasopp013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-023 Adio", () => {
  test("with an ODYSSEY Leader sets up to 3 rested DON!! active on play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [op09Adio023],
      activeDon: op09Adio023.cost,
    });

    engine.playCard(op09Adio023, "south");
    const choice = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Adio's active DON!! choice.");
    expect(choice.options.map((option) => option.id)).toEqual(["0", "1", "2", "3"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "3" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn rests 1 DON!! to protect a card during an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Adio023], activeDon: 2 },
      {
        character: [
          { card: op09Yasopp013, playedOnTurn: 0 },
          { card: op09Yasopp013, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
