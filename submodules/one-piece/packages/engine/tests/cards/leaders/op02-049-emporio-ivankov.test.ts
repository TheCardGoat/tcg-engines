import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02EmporioIvankov049 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-049 Emporio.Ivankov", () => {
  test("draws two cards at the end of its turn when its hand is empty", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EmporioIvankov049,
      hand: [],
      deck: [eb01Doma005, eb01Fourtricks025],
    });
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
