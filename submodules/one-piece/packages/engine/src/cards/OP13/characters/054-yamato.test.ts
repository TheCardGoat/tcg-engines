import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Yamato054 } from "../../../../../cards/src/cards/OP13/characters/054-yamato.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-054 Yamato", () => {
  test("at three Life draws two exact cards, then may give one rested DON!! to its Leader", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Yamato054],
      life: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op13Yamato054.cost,
      restedDon: 1,
    });
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op13Yamato054, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south.restedDon).toBe(5);
    expect(view.prompts).toHaveLength(0);
  });

  test("above three Life skips both the draw and subsequent rested DON!! transfer", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Yamato054],
      life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13Yamato054.cost,
      restedDon: 1,
    });

    engine.playCard(op13Yamato054, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.players.south.restedDon).toBe(6);
    expect(view.prompts).toHaveLength(0);
  });
});
