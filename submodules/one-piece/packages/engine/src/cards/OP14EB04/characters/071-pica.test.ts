import { op01RoronoaZoro001, op04DonquixoteDoflamingo019 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Pica071 } from "../../../../../cards/src/cards/OP14EB04/characters/071-pica.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-071 Pica", () => {
  test("at End Phase a compound Donquixote Pirates Leader may add one active DON", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      character: [op14eb04Pica071],
      donDeckCount: 1,
    });

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Pica's active DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("with a matching Leader may add no DON at End Phase", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04DonquixoteDoflamingo019,
      character: [op14eb04Pica071],
      donDeckCount: 1,
    });

    engine.endTurn("south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("a non-Donquixote Pirates Leader neither offers nor adds DON at End Phase", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      character: [op14eb04Pica071],
      donDeckCount: 1,
    });

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
