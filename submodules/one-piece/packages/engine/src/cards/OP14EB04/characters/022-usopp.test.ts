import { op01MonkeyDLuffy003, op06Uta001, op09Shanks001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Usopp022 } from "../../../../../cards/src/cards/OP14EB04/characters/022-usopp.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-022 Usopp", () => {
  test("with an included FILM Leader sets up to two rested DON!! active at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      character: [op14eb04Usopp022],
      restedDon: 3,
    });

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    engine.endTurn("south");

    const decision = engine.pendingDecision("effectSetActiveDon", "south");
    expect(decision.actorId).toBe("south");
    expect(decision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }, { id: "2" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("also accepts an included Straw Hat Crew Leader and may set zero DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01MonkeyDLuffy003,
      character: [op14eb04Usopp022],
      restedDon: 2,
    });

    engine.endTurn("south");
    expect(engine.pendingDecision("effectSetActiveDon", "south").actorId).toBe("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });

  test("without either printed Leader trait does not offer or activate DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      character: [op14eb04Usopp022],
      restedDon: 2,
    });

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });
});
