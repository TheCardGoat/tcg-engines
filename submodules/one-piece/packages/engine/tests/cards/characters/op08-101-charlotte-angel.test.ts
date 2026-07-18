import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlotteLinlin077,
  op08CharlotteAngel101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-101 Charlotte Angel", () => {
  test("pays top Life immediately, then adds the physical deck top to Life only at turn end", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03CharlotteLinlin077,
      character: [op08CharlotteAngel101],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
    });
    const angelId = engine.findCardInZone("south", "character", op08CharlotteAngel101);
    const paidLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const deckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(angelId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidLifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.deckCount).toBe(3);
    expect(engine.getState().players.south.life).not.toContain(deckTopId);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: angelId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.south.deckCount).toBe(2);
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(view.prompts).toHaveLength(0);
  });

  test("still pays top Life when a non-Big Mom Pirates Leader prevents the delayed result", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08CharlotteAngel101],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
    });
    const angelId = engine.findCardInZone("south", "character", op08CharlotteAngel101);
    const paidLifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const deckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(angelId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paidLifeId,
    );
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.deckCount).toBe(3);
    expect(engine.getState().players.south.deck[0]).toBe(deckTopId);
    expect(view.prompts).toHaveLength(0);
  });
});
