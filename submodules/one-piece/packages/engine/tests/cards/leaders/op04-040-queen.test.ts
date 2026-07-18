import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04MonkeyDLuffy014,
  op04Queen040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-040 Queen", () => {
  test("draws when the Life-and-hand total qualifies without a cost-8 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Queen040,
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({ lifeCount: 2, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets its controller replace the draw with an optional top-deck-to-Life action", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Queen040,
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
        character: [op04MonkeyDLuffy014],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const topDeckId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const choice = engine.pendingDecision("effectActionChoice", "south");
    const choiceStep = choice.steps[0];
    expect(choiceStep?.kind).toBe("chooseOption");
    if (choiceStep?.kind !== "chooseOption") {
      throw new Error("Expected Queen's controller to choose draw or Life replacement.");
    }
    expect(choiceStep.options.map((option) => option.label)).toEqual(["draw", "addToLife"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const lifeChoice = engine.pendingDecision("effectAddToLifeFromDeck", "south");
    const lifeStep = lifeChoice.steps[0];
    expect(lifeStep?.kind).toBe("chooseOption");
    if (lifeStep?.kind !== "chooseOption") {
      throw new Error("Expected Queen's controller to choose the replacement Life count.");
    }
    expect(lifeStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(3);
    expect(view.players.south.hand).toHaveLength(2);
    expect(engine.getState().players.south.life[0]).toBe(topDeckId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does nothing when the combined Life and hand total is above four", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Queen040,
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        character: [op04MonkeyDLuffy014],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      hand: expect.any(Array),
      lifeCount: 3,
      deckCount: 2,
    });
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
