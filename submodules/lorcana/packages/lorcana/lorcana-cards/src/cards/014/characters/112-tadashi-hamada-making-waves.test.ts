import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { bePrepared } from "../../001/actions/128-be-prepared";
import { motherKnowsBest } from "../../001/actions/095-mother-knows-best";
import { pegLatenightVocalist } from "./115-peg-late-night-vocalist";
import { tadashiHamadaMakingWaves } from "./112-tadashi-hamada-making-waves";

const killer = createMockCharacter({
  id: "tadashi-killer",
  name: "Killer",
  cost: 3,
  strength: 4,
  willpower: 2,
});

const banish = createMockAction({
  id: "tadashi-banish",
  name: "Banish",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
});
const bounce = createMockAction({
  id: "tadashi-bounce",
  name: "Bounce",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
});

// CR 6.2.3: banishment creates a bag trigger, then the controller resolves it.

describe("Tadashi Hamada - Making Waves", () => {
  it("does not reward another character being banished", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banish],
      play: [tadashiHamadaMakingWaves, killer],
    });
    expect(game.asPlayerOne().playCard(banish, { targets: [killer] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(killer)).toBe("discard");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("each of two banished copies rewards two drops", () => {
    const banishAll = createMockAction({
      id: "tadashi-banish-all",
      name: "Banish All",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "YOUR_CHARACTERS" } }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishAll],
      play: [tadashiHamadaMakingWaves, tadashiHamadaMakingWaves],
    });
    expect(game.asPlayerOne().playCard(banishAll)).toBeSuccessfulCommand();
    const bag = game.asPlayerOne().getBagEffects();
    expect(bag).toHaveLength(2);
    expect(game.asPlayerOne().resolveBag(bag[0]!.id, {})).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(3);
  });
  it("gets 2 ink drops when he is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: tadashiHamadaMakingWaves, isDrying: false }],
      },
      {
        play: [{ card: killer, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(tadashiHamadaMakingWaves, killer),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getCardZone(tadashiHamadaMakingWaves)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("rewards the controller after an opposing banishment effect", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [banish] },
      { play: [tadashiHamadaMakingWaves] },
    );
    expect(
      game.asPlayerOne().playCard(banish, { targets: [tadashiHamadaMakingWaves] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(tadashiHamadaMakingWaves)).toBe("discard");
    expect(
      game.asPlayerTwo().resolvePendingByCard(tadashiHamadaMakingWaves),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("rewards a banishment by your own effect", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banish],
      play: [tadashiHamadaMakingWaves],
      inkDrops: 1,
    });
    expect(
      game.asPlayerOne().playCard(banish, { targets: [tadashiHamadaMakingWaves] }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  });

  it("does not reward returning to hand", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bounce],
      play: [tadashiHamadaMakingWaves],
    });
    expect(
      game.asPlayerOne().playCard(bounce, { targets: [tadashiHamadaMakingWaves] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(tadashiHamadaMakingWaves)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
  });

  it("does not reward a surviving challenge", () => {
    const gentle = createMockCharacter({
      id: "tadashi-gentle",
      name: "Gentle",
      cost: 1,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: tadashiHamadaMakingWaves, isDrying: false }],
      },
      { play: [{ card: gentle, exerted: true }] },
    );
    expect(game.asPlayerOne().challenge(tadashiHamadaMakingWaves, gentle)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(tadashiHamadaMakingWaves)).toBe(1);
    expect(game.asPlayerTwo().getDamage(gentle)).toBe(4);
    expect(game.asPlayerOne().getCardZone(tadashiHamadaMakingWaves)).toBe("play");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("does not reward play or quest", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tadashiHamadaMakingWaves], inkwell: 5, deck: 3 },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(tadashiHamadaMakingWaves)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(tadashiHamadaMakingWaves)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("keeps the two drops across turns and can spend them as two ink", () => {
    const purchase = createMockCharacter({ id: "tadashi-purchase", name: "Purchase", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [banish, purchase],
        play: [tadashiHamadaMakingWaves],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(
      game.asPlayerOne().playCard(banish, { targets: [tadashiHamadaMakingWaves] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(purchase, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(purchase)).toBe("play");
  });

  it("gets no ink drops while he stays in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: tadashiHamadaMakingWaves, isDrying: false }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().getCardZone(tadashiHamadaMakingWaves)).toBe("play");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

it("player two receives their combat banishment reward and spends it after a turn cycle", () => {
  const purchase = createMockCharacter({ id: "tadashi-p2-purchase", name: "Purchase", cost: 2 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [killer], inkDrops: 3, deck: 6 },
    { play: [tadashiHamadaMakingWaves], hand: [purchase], deck: 6 },
  );
  expect(game.asPlayerOne().quest(killer)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(tadashiHamadaMakingWaves, killer)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(tadashiHamadaMakingWaves)).toBe("discard");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(purchase, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().getCardZone(purchase)).toBe("play");
});

it("Player Two gets four drops for two copies while return/play/quest do not reward, then spends saved rewards", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [tadashiHamadaMakingWaves], hand: [bePrepared], inkwell: 7, inkDrops: 3, deck: 8 },
    {
      play: [tadashiHamadaMakingWaves, tadashiHamadaMakingWaves],
      hand: [tadashiHamadaMakingWaves, motherKnowsBest, motherKnowsBest, pegLatenightVocalist],
      inkwell: 8,
      deck: 8,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p2 = game.asPlayerTwo();
  const ownCopies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const opposing = game.findCardInstanceId(tadashiHamadaMakingWaves, "play", PLAYER_ONE)!;
  const third = game.findCardInstanceId(tadashiHamadaMakingWaves, "hand", PLAYER_TWO)!;
  const bounceCards = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => p2.getCardDefinitionByInstanceId(id).id === motherKnowsBest.id);
  expect(p2.playCard(third)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(p2.quest(ownCopies[0]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(3);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(p2.playCard(bounceCards[0]!, { targets: [third] })).toBeSuccessfulCommand();
  expect(p2.getCardZone(third)).toBe("hand");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(p2.getBagEffects()).toHaveLength(0);
  expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(p2.passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(opposing)).toBe("discard");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().resolvePendingByCard(ownCopies[0]!)).not.toBeSuccessfulCommand();
  expect(p2.resolvePendingByCard(ownCopies[0]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  for (const copy of ownCopies) expect(p2.getCardZone(copy)).toBe("discard");
  expect(p2.getCardZone(third)).toBe("hand");
  expect(p2.getBagEffects()).toHaveLength(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(p2.playCard(third)).toBeSuccessfulCommand();
  expect(p2.playCard(bounceCards[1]!, { targets: [third] })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(p2.playCard(pegLatenightVocalist, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(p2.getCardZone(pegLatenightVocalist)).toBe("play");
  expect(p2.getCardZone(third)).toBe("hand");
});
