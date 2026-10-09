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
  test("playing Linlin sets only own 4000-base-power Trigger Characters to 8000 during your turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-001",
        hand: [op17CharlotteLinlin112],
        character: ["OP03-033", "OP01-012", "OP16-107"],
        activeDon: 11,
        deck: ["EB01-005", "EB01-025", "EB01-018"],
      },
      { leaderCardId: "OP01-001", character: ["OP03-033"] },
    );
    const south = engine.asSouth();
    const hatchan = south.findOnField("OP03-033");
    south.play(op17CharlotteLinlin112);
    south.chooseOption("effectActionChoice", "0");
    south.chooseAmount(0, "effectAddToLifeFromDeck");

    expect(
      south.view().players.south.characters.flatMap((card) => (card ? [card.power] : [])),
    ).toEqual([8000, 4000, 5000, 12000]);
    expect(south.view().players.north.characters[0]?.power).toBe(4000);
    south.attachDon(hatchan, 1);
    expect(south.view().players.south.characters[0]?.power).toBe(9000);

    south.endTurn();
    expect(south.view().players.south.characters[0]?.power).toBe(4000);
    expect(south.view().players.south.characters[1]?.power).toBe(4000);
    expect(south.view().players.south.characters[2]?.power).toBe(5000);
  });

  test("a qualifying Character played after Linlin also receives the continuous power", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: "OP01-001",
      character: [op17CharlotteLinlin112],
      hand: ["OP03-033"],
      activeDon: 4,
    });
    engine.asSouth().play("OP03-033");
    expect(
      engine
        .asSouth()
        .view()
        .players.south.characters.find((card) => card?.cardId === "OP03-033")?.power,
    ).toBe(8000);
  });
});
