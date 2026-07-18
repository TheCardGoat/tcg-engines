import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Magellan085 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-085 Magellan", () => {
  test("may pay DON!! -1 before the opponent chooses 1 of their DON!! to return", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Magellan085], activeDon: 6 },
      { character: [{ card: eb01Doma005, attachedDon: 1 }], activeDon: 1, donDeckCount: 8 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownDonDeckBefore = engine.getView("south").players.south.donDeckCount;
    const opponentDonDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.playCard(op02Magellan085, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const opponentChoice = engine.pendingDecision("effectOpponentReturnDon", "north").steps[0];
    expect(opponentChoice?.kind).toBe("payCost");
    if (opponentChoice?.kind !== "payCost") {
      throw new Error("Expected Magellan's opponent to choose the DON!! they return.");
    }
    expect(opponentChoice.candidates).toHaveLength(2);
    engine.resolveDecision(
      "effectOpponentReturnDon",
      { selectedIds: [opponentChoice.candidates[0]!.ref.id] },
      "north",
    );

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      donDeckCount: ownDonDeckBefore + 1,
    });
    expect(engine.getView("north").players.north).toMatchObject({
      donDeckCount: opponentDonDeckBefore + 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without either player returning DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Magellan085], activeDon: 6 },
      { activeDon: 2, donDeckCount: 8 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownDonDeckBefore = engine.getView("south").players.south.donDeckCount;
    const opponentDonDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.playCard(op02Magellan085, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      donDeckCount: ownDonDeckBefore,
    });
    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 2,
      donDeckCount: opponentDonDeckBefore,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("makes the opponent return 2 DON!! when K.O.'d during their turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Magellan085, rested: true }] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, attachedDon: 1 },
        ],
        activeDon: 2,
        donDeckCount: 7,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const magellanId = engine.findCardInZone("south", "character", op02Magellan085);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, magellanId, "north");

    const opponentChoice = engine.pendingDecision("effectOpponentReturnDon", "north").steps[0];
    expect(opponentChoice?.kind).toBe("payCost");
    if (opponentChoice?.kind !== "payCost") {
      throw new Error("Expected Magellan's opponent to choose 2 DON!! to return.");
    }
    expect(opponentChoice.candidates).toHaveLength(3);
    engine.resolveDecision(
      "effectOpponentReturnDon",
      { selectedIds: opponentChoice.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(magellanId);
    expect(view.players.north.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.prompts).toHaveLength(0);
  });
});
