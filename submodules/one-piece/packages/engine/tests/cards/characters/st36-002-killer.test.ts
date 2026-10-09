import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st36-002-killer", () => {
  test("own-turn OnPlay adds top deck Life for Kid Pirates Leader", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST02-001",
        hand: ["ST36-002"],
        activeDon: 4,
        deck: ["ST21-005", "ST21-006"],
      },
      {},
    );
    e.playCard("ST36-002");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(6);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("wrong Leader suppresses only the OnPlay clause", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST36-002"], activeDon: 4, deck: 3 }, {});
    e.playCard("ST36-002");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines optional OnPlay Life addition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST02-001",
      hand: ["ST36-002"],
      activeDon: 4,
      deck: 3,
    });
    e.playCard("ST36-002");
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(5);
    expect(e.getView("south").players.south.deckCount).toBe(3);
  });
  test.each([3, 4])(
    "Life Trigger checks opponentLife%s and does not activate own-turn OnPlay",
    (life) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST02-001", life: ["ST36-002"], deck: 3 },
        { life },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const id = e.findCardInZone("south", "life", "ST36-002");
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === id)).toBe(
        life === 3,
      );
      expect(e.getView("south").players.south.lifeCount).toBe(0);
      expect(e.getView("south").players.south.deckCount).toBe(3);
    },
  );
});
