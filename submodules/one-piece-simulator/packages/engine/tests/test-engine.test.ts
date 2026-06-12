import { describe, expect, test } from "vite-plus/test";
import { createTestMatchState, OnePieceTestEngine } from "../src/index.ts";

describe("OnePieceTestEngine fixtures", () => {
  test("seeds deterministic zones and card state", () => {
    const state = createTestMatchState(
      {
        hand: ["OP13-043"],
        deck: ["OP13-021"],
        life: 3,
        character: [{ cardId: "OP13-013", rested: true, attachedDon: 2, playedOnTurn: 1 }],
        stage: "OP13-022",
        trash: ["OP13-037"],
        activeDon: 4,
        restedDon: 1,
      },
      { deck: 2 },
      { seed: "fixture-test" },
    );

    const south = state.players.south;
    const characterId = south.characterArea[0]!;

    expect(state.status).toBe("active");
    expect(state.phase).toBe("main");
    expect(south.hand.map((id) => state.cards[id]?.cardId)).toEqual(["OP13-043"]);
    expect(south.deck.map((id) => state.cards[id]?.cardId)).toEqual(["OP13-021"]);
    expect(south.life).toHaveLength(3);
    expect(state.cards[characterId]).toMatchObject({
      cardId: "OP13-013",
      zone: "character",
      rested: true,
      attachedDon: 2,
      playedOnTurn: 1,
    });
    expect(state.cards[south.stageArea!]?.cardId).toBe("OP13-022");
    expect(south.trash.map((id) => state.cards[id]?.cardId)).toEqual(["OP13-037"]);
    expect(south.activeDon).toBe(4);
    expect(south.restedDon).toBe(1);
  });

  test("drives accepted and rejected commands through the engine wrapper", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP13-043"],
      activeDon: 1,
      life: 3,
    });

    engine.playCard("OP13-043");

    const played = engine.findCardInZone("south", "character", "OP13-043");
    expect(engine.getState().cards[played]?.zone).toBe("character");
    expect(engine.getState().players.south.restedDon).toBe(1);

    const failure = engine.expectFailure({
      type: "attachDon",
      seat: "south",
      targetId: played,
      amount: 10,
    });
    expect(failure.reason).toBe("Not enough active DON!! to attach.");
  });
});
