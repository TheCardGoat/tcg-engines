import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Cabaji005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-005 Cabaji", () => {
  test("gains +2000 while attacking an opponent who has DON!! cards given", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [
          { card: op15Cabaji005, playedOnTurn: 0 },
          { card: eb01Doma005, attachedDon: 1 },
        ],
        activeDon: 3,
      },
      { character: [{ card: eb01Doma005, rested: true, attachedDon: 2 }] },
    );
    const cabajiId = engine.findCardInZone("south", "character", op15Cabaji005);

    engine.declareAttack(cabajiId, engine.leader("north"), "south");

    const power = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === cabajiId)?.power;
    expect(power).toBe(5000);
    // The boost is scoped to the whole turn, so it outlives the battle...
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === cabajiId)
        ?.power,
    ).toBe(5000);
    // ...and expires when the turn ends.
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === cabajiId)
        ?.power,
    ).toBe(3000);
  });

  test("gains nothing while the opponent has no given DON!! cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [{ card: op15Cabaji005, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [{ card: eb01Doma005, rested: true }] },
    );
    const cabajiId = engine.findCardInZone("south", "character", op15Cabaji005);

    engine.declareAttack(cabajiId, engine.leader("north"), "south");

    const power = engine
      .getView("south")
      .players.south.characters.find((c) => c?.instanceId === cabajiId)?.power;
    expect(power).toBe(3000);
  });
});
