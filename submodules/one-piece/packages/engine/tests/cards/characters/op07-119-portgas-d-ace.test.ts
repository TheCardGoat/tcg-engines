import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op07PortgasDAce119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function addTopDeckCardToLife(engine: OnePieceTestEngine) {
  const life = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
  if (life?.kind !== "chooseOption") throw new Error("Expected Ace's deck-to-Life choice.");
  expect(life.options.map((option) => option.id)).toEqual(["0", "1"]);
  engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
}

describe("OP07-119 Portgas.D.Ace", () => {
  test("after adding deck top to reach two Life, gains Rush and attacks the turn played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07PortgasDAce119],
        life: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op07PortgasDAce119.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op07PortgasDAce119, "south");
    const aceId = engine.findCardInZone("south", "character", op07PortgasDAce119);
    addTopDeckCardToLife(engine);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore + 1);
    engine.declareAttack(aceId, engine.leader("north"), "south");
  });

  test("after adding deck top above two Life, does not gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07PortgasDAce119],
        life: [eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005],
        activeDon: op07PortgasDAce119.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op07PortgasDAce119, "south");
    const aceId = engine.findCardInZone("south", "character", op07PortgasDAce119);
    addTopDeckCardToLife(engine);

    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: aceId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
  });
});
