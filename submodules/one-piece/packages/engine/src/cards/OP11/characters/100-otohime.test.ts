import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op11Otohime100, op11Shirahoshi022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-100 Otohime", () => {
  test("with Shirahoshi, turns the top Life face-down as its optional draw cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [op11Otohime100],
      life: [{ card: eb01Doma005, faceUp: true }],
      deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op11Otohime100.cost,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op11Otohime100, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("without Shirahoshi, neither flips Life nor draws", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Otohime100],
      life: [{ card: eb01Doma005, faceUp: true }],
      deck: [eb01Fourtricks025, eb01Doma005],
      activeDon: op11Otohime100.cost,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op11Otohime100, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(engine.getState().cards[lifeId]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
