import { describe, expect, test } from "vite-plus/test";
import { op02Sanji026, op09Shanks001 } from "@tcg/op-cards";
import { prb02MonkeyDLuffyPrb02005005 } from "../../../../../cards/src/cards/PRB02/characters/005-monkey-d-luffy-prb02-005.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("PRB02-005 Monkey.D.Luffy", () => {
  test("with a multicolored Leader schedules one opposing DON!! to rest only at the start of their next Main Phase", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Sanji026,
        hand: [prb02MonkeyDLuffyPrb02005005],
        activeDon: prb02MonkeyDLuffyPrb02005005.cost,
      },
      { activeDon: 7, donDeckCount: 0 },
    );

    engine.playCard(prb02MonkeyDLuffyPrb02005005, "south");
    expect(engine.getView("south").players.north).toMatchObject({ activeDon: 7, restedDon: 0 });

    engine.endTurn("south");

    const restDecision = engine.pendingDecision("effectRestDonCount", "north").steps[0];
    if (restDecision?.kind !== "chooseOption") {
      throw new Error("Expected the opponent's mandatory one-DON!! rest decision.");
    }
    expect(restDecision.options.map((option) => option.id)).toEqual(["1"]);
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 6, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not schedule the DON!! rest with a monocolored Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Shanks001,
        hand: [prb02MonkeyDLuffyPrb02005005],
        activeDon: prb02MonkeyDLuffyPrb02005005.cost,
      },
      { activeDon: 7, donDeckCount: 0 },
    );

    engine.playCard(prb02MonkeyDLuffyPrb02005005, "south");
    engine.endTurn("south");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 7, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not schedule the DON!! rest above seven opposing DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Sanji026,
        hand: [prb02MonkeyDLuffyPrb02005005],
        activeDon: prb02MonkeyDLuffyPrb02005005.cost,
      },
      { activeDon: 8, donDeckCount: 0 },
    );

    engine.playCard(prb02MonkeyDLuffyPrb02005005, "south");
    engine.endTurn("south");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 8, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
