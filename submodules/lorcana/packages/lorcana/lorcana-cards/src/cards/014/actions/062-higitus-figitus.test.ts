// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns and are
// spendable the turn they are created.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001";
import { higitusFigitus } from "./062-higitus-figitus";
import { khanTransportDelivery } from "./199-khan-transport-delivery";

describe("Higitus Figitus", () => {
  it("gets 3 ink drops when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus],
      inkwell: higitusFigitus.cost,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(3);
  });

  it("ink drops pay ink costs the same turn alongside inkwell ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus, khanTransportDelivery],
      inkwell: higitusFigitus.cost + 1,
      deck: [aladdinPrinceAli],
    });

    expect(testEngine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(3);

    // Khan Transport Delivery costs 2: only 1 ready ink remains in the
    // inkwell, so the second {I} must come from a removed ink drop.
    expect(
      testEngine.asPlayerOne().playCard(khanTransportDelivery, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();

    // 3 drops - 1 removed to pay + 1 gained from Khan Transport Delivery itself.
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(3);
    // Drew 1 card from Khan Transport Delivery.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });

  it("keeps unspent ink drops for later turns", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [higitusFigitus],
        inkwell: higitusFigitus.cost,
        deck: 3,
      },
      { deck: 3 },
    );

    expect(testEngine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(3);
  });
  it("adds three to existing drops only for its controller", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [higitusFigitus], inkwell: 6, inkDrops: 2 },
      { inkDrops: 4 },
    );
    expect(engine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(5);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(4);
  });

  it("can be sung by a ready cost-six character without ink", () => {
    const singer = createMockCharacter({ id: "figitus-singer", name: "Singer", cost: 6 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus],
      play: [{ card: singer, isDrying: false }],
      inkwell: 0,
    });
    expect(engine.asPlayerOne().singSong(higitusFigitus, singer)).toBeSuccessfulCommand();
    expect(engine.isExerted(singer)).toBe(true);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(engine.asPlayerOne().getCardZone(higitusFigitus)).toBe("discard");
  });

  it("rejects an insufficient or drying singer without creating drops", () => {
    for (const drying of [false, true]) {
      const singer = createMockCharacter({
        id: "figitus-invalid-singer",
        name: "Singer",
        cost: drying ? 6 : 5,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [higitusFigitus],
        play: [{ card: singer, isDrying: drying }],
      });
      expect(engine.asPlayerOne().singSong(higitusFigitus, singer)).not.toBeSuccessfulCommand();
      expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(engine.isExerted(singer)).toBe(false);
      expect(engine.asPlayerOne().getCardZone(higitusFigitus)).toBe("hand");
    }
  });

  it("pays a later card entirely with the three newly created drops", () => {
    const purchase = createMockAction({
      id: "figitus-purchase",
      name: "Purchase",
      cost: 3,
      abilities: [
        { type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus, purchase],
      inkwell: 6,
    });
    expect(engine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(purchase, { inkDrops: 3 })).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not use the drops it would create to pay its own six-ink cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus],
      inkwell: 5,
    });
    expect(engine.asPlayerOne().playCard(higitusFigitus)).not.toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().getCardZone(higitusFigitus)).toBe("hand");
  });

  it("adds the printed three drops even to a large existing total", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [higitusFigitus],
      inkwell: 6,
      inkDrops: 19,
    });
    expect(engine.asPlayerOne().playCard(higitusFigitus)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(22);
  });
  it("player two sings for three drops, spends one immediately and retains the rest across turns", () => {
    const singer = createMockCharacter({
      id: "figitus-player-two-singer",
      name: "Singer",
      cost: 6,
    });
    const purchase = createMockCharacter({
      id: "figitus-player-two-purchase",
      name: "Purchase",
      cost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkDrops: 4 },
      { deck: 6, hand: [higitusFigitus, purchase], play: [singer], inkwell: 0 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(higitusFigitus, singer)).toBeSuccessfulCommand();
    expect(game.isExerted(singer)).toBe(true);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(purchase)).toBe("play");
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  });
});

it("Player Two adds three on each play, pays the second song before its gain, and spends the result after a turn boundary", () => {
  const second = { ...higitusFigitus, id: "figitus-p2-second" };
  const firstPurchase = createMockCharacter({
    id: "figitus-p2-first-buy",
    name: "First Purchase",
    cost: 1,
  });
  const laterPurchase = createMockCharacter({
    id: "figitus-p2-later-buy",
    name: "Later Purchase",
    cost: 2,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, inkDrops: 4 },
    {
      deck: 6,
      hand: [higitusFigitus, second, firstPurchase, laterPurchase],
      inkwell: 8,
      inkDrops: 1,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(higitusFigitus)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(second, { inkDrops: 4 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(2);
  expect(game.asPlayerTwo().playCard(firstPurchase, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(laterPurchase, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(8);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
});
it("Player Two cannot use the three prospective drops to pay the song itself", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, inkDrops: 4 },
    { deck: 6, hand: [higitusFigitus], inkwell: 5 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(higitusFigitus, { inkDrops: 3 })).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().getCardZone(higitusFigitus)).toBe("hand");
  expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(0);
});
