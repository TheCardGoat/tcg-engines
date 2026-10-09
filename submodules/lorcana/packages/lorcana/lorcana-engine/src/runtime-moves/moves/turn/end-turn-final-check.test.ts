// CR 3.4.1.1–3.4.2, 6.1.13.4 and 1.8.1.2: end-turn effects precede the final deck check.
import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "../../../testing";
const target = createMockCharacter({
  id: "final-check-target",
  name: "Target",
  cost: 1,
  strength: 2,
  willpower: 2,
});
const buff = createMockAction({
  id: "final-check-buff",
  name: "Buff",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 4,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});
const longer = createMockAction({
  id: "final-check-longer",
  name: "Longer",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});
it("expires this-turn stats before player two loses, preserves longer effects and does not start another turn", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [target], deck: 6 },
    { hand: [buff, longer], deck: 1 },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  expect(g.asPlayerTwo().playCard(buff, { targets: [target] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().playCard(longer, { targets: [target] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(target)).toBe(9);
  expect(g.asServer().getWinner()).toBeUndefined();
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(target)).toBe(5);
  expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
  expect(g.asServer().getCurrentPhase()).toBe("end");
  expect(g.asServer().getTurnNumber()).toBe(2);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
});
const recycle = createMockCharacter({
  id: "final-check-recycle",
  name: "Recycle",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "end-turn", on: "YOU", timing: "at" },
      effect: {
        type: "shuffle-into-deck",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});
it("allows an end-turn effect to refill the deck before deciding deck loss", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [recycle], discard: [target], deck: [] },
    { deck: 6 },
  );
  const recycled = g.findCardInstanceId(target, "discard", PLAYER_ONE);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asServer().getWinner()).toBeUndefined();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(
    g.asPlayerOne().resolvePendingByCard(recycle, { targets: [recycled] }),
  ).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([recycled]);
  expect(g.asServer().getWinner()).toBeUndefined();
  expect(g.asServer().getTurnNumber()).toBe(2);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});
const winning = createMockCharacter({
  id: "final-check-winning",
  name: "Winning",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "end-turn", on: "YOU", timing: "at" },
      effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
    },
  ],
});
it("wins from an end-turn lore effect before an empty-deck loss or another player's draw", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [winning, target], hand: [buff], lore: 19, deck: [] },
    { deck: 6 },
  );
  const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(g.asPlayerOne().playCard(buff, { targets: [target] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(target)).toBe(6);
  expect(g.getLore(PLAYER_ONE)).toBe(20);
  expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
  expect(g.asServer().getTurnNumber()).toBe(1);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(opposingDeck);
});
const reviver = createMockCharacter({
  id: "final-check-reviver",
  name: "Reviver",
  cost: 1,
  willpower: 2,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "banish", on: "SELF", timing: "when" },
      effect: {
        type: "shuffle-into-deck",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});
const endurance = createMockAction({
  id: "final-check-endurance",
  name: "Endurance",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});
const damage = createMockAction({
  id: "final-check-damage",
  name: "Damage",
  cost: 0,
  abilities: [
    { type: "action", effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" } },
  ],
});
it("finishes banishment triggers caused by expired Willpower before checking the empty deck", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [reviver], hand: [endurance, damage], deck: [] },
    { deck: 6 },
  );
  const source = g.findCardInstanceId(reviver, "play", PLAYER_ONE);
  expect(g.asPlayerOne().playCard(endurance, { targets: [source] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().playCard(damage, { targets: [source] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(source)).toBe("play");
  expect(g.asPlayerOne().getDamage(source)).toBe(3);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(source)).toBe("discard");
  expect(g.asServer().getWinner()).toBeUndefined();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(g.asServer().getMoveLogHistory().at(-1)?.public).toContainEqual({
    key: "lorcana.outcome.cardBanished",
    values: { playerId: PLAYER_ONE, cardId: source },
  });
  expect(
    g.asPlayerOne().resolvePendingByCard(source, { targets: [source] }),
  ).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([source]);
  expect(g.asServer().getWinner()).toBeUndefined();
  expect(g.asServer().getTurnNumber()).toBe(2);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});
