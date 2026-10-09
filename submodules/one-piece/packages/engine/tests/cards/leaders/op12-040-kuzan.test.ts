import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Kuzan040, op12ZephyrNavy046 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-040 Kuzan", () => {
  test("draws the same number after a Navy effect trashes multiple cards from hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Kuzan040,
      hand: [op12ZephyrNavy046, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 5,
    });
    const zephyrId = engine.findCardInZone("south", "hand", op12ZephyrNavy046);
    const paymentIds = engine
      .getView("south")
      .players.south.hand.filter((card) => card.cardId === eb01Doma005.id)
      .map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id));

    engine.playCard(op12ZephyrNavy046, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === zephyrId)).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("draws for Garp's Navy activation cost only after Garp has finished its play effect", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Kuzan040,
      hand: ["OP12-056", eb01Doma005],
      deck: ["ST06-007", eb01Doma005],
      activeDon: 8,
    });
    engine.playCard("OP12-056", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.cardId)).toEqual(["ST06-007"]);
    expect(view.players.south.characters.filter(Boolean).map((card) => card?.cardId)).toEqual([
      "OP12-056",
    ]);
    expect(view.prompts).toHaveLength(0);
  });
});
