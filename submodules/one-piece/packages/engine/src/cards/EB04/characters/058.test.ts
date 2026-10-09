import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-058", () => {
  test("Blocker intercepts an attack instead of the Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-058"], life: 2 },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const defender = engine.findCardInZone("south", "character", "EB04-058");
    engine.asNorth().attack("EB01-018", engine.leader("south"));
    engine.asSouth().chooseBlocker(defender);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").players.south.trash.some((c) => c.instanceId === defender)).toBe(
      true,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] with 2 or less Life adds the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-058"], life: ["OP12-013"], deck: ["OP12-017", "OP13-013"], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB04-058");
    const add = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
    if (add?.kind !== "chooseOption") throw new Error("Expected the Life count choice.");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] with 3 Life offers nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-058"],
        life: ["OP12-013", "OP12-017", "OP12-018"],
        deck: ["OP12-017", "OP13-013"],
        activeDon: 5,
      },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("EB04-058");

    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
