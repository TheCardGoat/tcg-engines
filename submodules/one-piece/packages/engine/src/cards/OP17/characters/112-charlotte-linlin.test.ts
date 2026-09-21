import { describe, expect, test } from "vite-plus/test";
import { op17CharlotteLinlin112 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-112 Charlotte Linlin", () => {
  test("draws 1 then adds the top deck card to its owner's Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17CharlotteLinlin112],
        deck: ["OP16-096", "OP16-095", "OP16-109"],
        life: 2,
        activeDon: op17CharlotteLinlin112.cost,
      },
      {},
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op17CharlotteLinlin112, "south");
    console.log(
      "AFTER-PLAY:",
      JSON.stringify({
        hand: engine.getView("south").players.south.hand.map((c) => c.cardId),
        deck: engine.getView("south").players.south.deckCount,
        prompts: engine.getView("south").prompts.map((p) => p.label),
        queue: engine.getState().resolutionQueue.map((q) => q.kind),
      }),
    );
    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    if (choice?.kind !== "chooseOption") throw new Error("Expected the branch choice.");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.lifeCount).toBe(lifeBefore + 1);
    expect(view.hand).toHaveLength(1);
    expect(view.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the alternative branch moves the opponent's top Life to its hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17CharlotteLinlin112],
        deck: ["OP16-096", "OP16-095", "OP16-109"],
        activeDon: op17CharlotteLinlin112.cost,
      },
      { life: ["OP13-013", "OP16-109", "OP16-095", "OP16-096", "OP16-097"] },
    );
    const northLifeBefore = engine.getView("south").players.north.lifeCount;
    const northHandBefore = engine.getView("south").players.north.hand.length;

    engine.playCard(op17CharlotteLinlin112, "south");
    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    if (choice?.kind !== "chooseOption") throw new Error("Expected the branch choice.");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const remove = engine.pendingDecision("effectRemoveFromLifeCount", "south").steps[0];
    if (remove?.kind !== "chooseOption") throw new Error("Expected the Life count choice.");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const north = engine.getView("south").players.north;
    expect(north.lifeCount).toBe(northLifeBefore - 1);
    expect(north.hand.length).toBe(northHandBefore + 1);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
