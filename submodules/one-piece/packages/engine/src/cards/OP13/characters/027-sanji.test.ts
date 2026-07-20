import { op01MonkeyDLuffy003, op06Uta001, op09Shanks001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Sanji027 } from "../../../../../cards/src/cards/OP13/characters/027-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-027 Sanji", () => {
  test("activates two DON!! on play and another at end of turn with a FILM Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      hand: [op13Sanji027],
      activeDon: op13Sanji027.cost,
      restedDon: 3,
    });

    engine.playCard(op13Sanji027, "south");
    const onPlay = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(onPlay).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }, { id: "2" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 2, restedDon: 6 });

    engine.endTurn("south");
    const endTurn = engine.pendingDecision("effectSetActiveDon", "south");
    expect(endTurn.actorId).toBe("south");
    expect(endTurn.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("also accepts a Straw Hat Crew Leader without FILM", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01MonkeyDLuffy003,
      character: [op13Sanji027],
      restedDon: 1,
    });

    engine.endTurn("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not activate end-turn DON!! without either printed Leader trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      character: [op13Sanji027],
      restedDon: 2,
    });

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });
});
