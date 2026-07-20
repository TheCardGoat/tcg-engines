import { describe, expect, test } from "vite-plus/test";
import { op06Uta001, op09Shanks001, op13MonkeyDLuffy001 } from "@tcg/op-cards";
import { op13Brook034 } from "../../../../../cards/src/cards/OP13/characters/034-brook.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-034 Brook", () => {
  test("with a FILM Leader, On Play may set one rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      hand: [op13Brook034],
      activeDon: op13Brook034.cost,
      restedDon: 1,
    });

    engine.playCard(op13Brook034, "south");
    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    expect(decision.actorId).toBe("south");
    expect(decision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
  });

  test("also accepts an included Straw Hat Crew Leader trait and permits choosing zero", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13MonkeyDLuffy001,
      hand: [op13Brook034],
      activeDon: op13Brook034.cost,
      restedDon: 1,
    });

    engine.playCard(op13Brook034, "south");
    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    expect(decision.actorId).toBe("south");
    expect(decision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
  });

  test("with neither printed Leader trait, On Play does not activate DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op13Brook034],
      activeDon: op13Brook034.cost,
      restedDon: 1,
    });

    engine.playCard(op13Brook034, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.prompts).toHaveLength(0);
  });
});
