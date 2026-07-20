import { eb01Doma005, op12SilversRayleigh001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Buggy072 } from "../../../../../cards/src/cards/OP13/characters/072-buggy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-072 Buggy", () => {
  test("with both an included Roger Pirates Leader and a given DON!! may add one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op13Buggy072],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13Buggy072.cost,
    });

    engine.playCard(op13Buggy072, "south");
    const choice = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(choice).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(op13Buggy072.cost + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("skips the action when either the Leader type or given-DON!! condition is missing", () => {
    const missingLeader = OnePieceTestEngine.create({
      hand: [op13Buggy072],
      character: [{ card: eb01Doma005, attachedDon: 1 }],
      activeDon: op13Buggy072.cost,
    });
    missingLeader.playCard(op13Buggy072, "south");
    expect(missingLeader.getView("south").players.south.restedDon).toBe(op13Buggy072.cost);
    expect(missingLeader.getView("south").prompts).toHaveLength(0);

    const missingGivenDon = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op13Buggy072],
      activeDon: op13Buggy072.cost,
    });
    missingGivenDon.playCard(op13Buggy072, "south");
    expect(missingGivenDon.getView("south").players.south.restedDon).toBe(op13Buggy072.cost);
    expect(missingGivenDon.getView("south").prompts).toHaveLength(0);
  });
});
