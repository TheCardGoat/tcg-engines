import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-060 Gum-Gum Hawk Gatling", () => {
  test("[Main] the add-Life-to-hand cost moves the top Life card to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-060", "EB01-005"],
        activeDon: 6,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const state = engine.getState();
    const topLifeCard = state.cards[state.players.south.life[0]!]!.cardId;

    engine.playCard("EB04-060");
    engine.acceptLeadingOptional("south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand.map((card) => card.cardId)).toContain(topLifeCard);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["EB04-060"], activeDon: 4 }, {});

    engine.playCard("EB04-060");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-060");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
