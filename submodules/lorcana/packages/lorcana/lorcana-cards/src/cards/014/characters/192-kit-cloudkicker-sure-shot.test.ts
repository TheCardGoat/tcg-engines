import { resist, ward } from "../../../helpers/abilities";
// CR 8.10: Shift preserves the base state; 6.2.1: each quest triggers one choice.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { kitCloudkickerUnpredictableCourier } from "./174-kit-cloudkicker-unpredictable-courier";
import { kitCloudkickerSureShot } from "./192-kit-cloudkicker-sure-shot";

const target = createMockCharacter({
  id: "kit-target",
  name: "Target",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Kit Cloudkicker - Sure Shot", () => {
  it("on quest, choice 1 grants an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [kitCloudkickerSureShot],
        inkwell: kitCloudkickerSureShot.cost,
      },
      { play: [target] },
    );

    expect(testEngine.asPlayerOne().playCard(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(1);
  });

  it("on quest, choice 2 deals 1 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [kitCloudkickerSureShot],
        inkwell: kitCloudkickerSureShot.cost,
      },
      { play: [target] },
    );

    expect(testEngine.asPlayerOne().playCard(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWith(target)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: target, value: 1 });
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(0);
  });
});

describe("Kit Cloudkicker - Sure Shot (Shift)", () => {
  const shiftBase = kitCloudkickerUnpredictableCourier;

  it("shifts onto a Kit Cloudkicker character for 3 {I} and its quest still offers both options", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [kitCloudkickerSureShot],
        inkwell: 3,
        deck: 1,
        play: [{ card: shiftBase, isDrying: false }],
      },
      { play: [target] },
    );

    const shiftTargetId = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
    if (!shiftTargetId) throw new Error("Expected Kit shift base in play");
    expect(
      testEngine.asPlayerOne().playCard(kitCloudkickerSureShot, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(kitCloudkickerSureShot)).toBe("play");
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(1);
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: target, value: 0 });
  });
});

describe("Kit Sure Shot Shift state boundaries", () => {
  for (const state of [
    { isDrying: true, exerted: false },
    { isDrying: false, exerted: true },
  ]) {
    it(`inherits drying=${state.isDrying} and exerted=${state.exerted} from its base`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kitCloudkickerSureShot],
        inkwell: 3,
        deck: 3,
        play: [{ card: kitCloudkickerUnpredictableCourier, ...state }],
      });
      const shiftTarget = game.findCardInstanceId(
        kitCloudkickerUnpredictableCourier,
        "play",
        PLAYER_ONE,
      );
      if (!shiftTarget) throw new Error("Expected Kit base");
      expect(
        game
          .asPlayerOne()
          .playCard(kitCloudkickerSureShot, { cost: { cost: "shift", shiftTarget } }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(kitCloudkickerSureShot)).toBe(state.exerted);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    });
  }
  it("preserves base damage and rejects insufficient Shift payment", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kitCloudkickerSureShot],
      inkwell: 2,
      deck: 3,
      play: [{ card: kitCloudkickerUnpredictableCourier, isDrying: false, damage: 1 }],
    });
    const shiftTarget = game.findCardInstanceId(
      kitCloudkickerUnpredictableCourier,
      "play",
      PLAYER_ONE,
    );
    if (!shiftTarget) throw new Error("Expected Kit base");
    expect(
      game.asPlayerOne().playCard(kitCloudkickerSureShot, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getCardZone(kitCloudkickerSureShot)).toBe("hand");
    expect(game.asPlayerOne().getDamage(kitCloudkickerUnpredictableCourier)).toBe(1);
    expect(
      game.asPlayerOne().putIntoInkwell(PLAYER_ONE, kitCloudkickerSureShot),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

describe("Kit Sure Shot damage mode boundaries", () => {
  for (const kind of ["friendly", "self", "lethal", "resist"]) {
    it(`damage mode handles ${kind} target without gaining a drop`, () => {
      const victim = createMockCharacter({
        id: "kit-mode-victim",
        name: "Mode Victim",
        cost: 1,
        strength: 0,
        willpower: kind === "lethal" ? 1 : 4,
        abilities: kind === "resist" ? [resist(1)] : [],
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: kitCloudkickerSureShot, isDrying: false },
            ...(kind === "friendly" ? [victim] : []),
          ],
          deck: 3,
        },
        { play: kind === "friendly" || kind === "self" ? [] : [victim], deck: 3 },
      );
      const chosen = kind === "self" ? kitCloudkickerSureShot : victim;
      expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().respondWith(chosen)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(2);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().isExerted(kitCloudkickerSureShot)).toBe(true);
      if (kind === "lethal") expect(game.asPlayerTwo().getCardZone(victim)).toBe("discard");
      else expect(game.asPlayerOne().getDamage(chosen)).toBe(kind === "resist" ? 0 : 1);
    });
  }

  it("player two controls the quest choice and receives only their own drop", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 3 },
      { play: [{ card: kitCloudkickerSureShot, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 0 }),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(
      game.asPlayerTwo().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 0 }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getLore(PLAYER_TWO)).toBe(2);
  });

  it("successful Shift preserves damage and can immediately choose the damage mode", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [kitCloudkickerSureShot],
        play: [{ card: kitCloudkickerUnpredictableCourier, isDrying: false, damage: 1 }],
        inkwell: 3,
        deck: 3,
      },
      { play: [target], deck: 3 },
    );
    const shiftTarget = game.findCardInstanceId(
      kitCloudkickerUnpredictableCourier,
      "play",
      PLAYER_ONE,
    );
    if (!shiftTarget) throw new Error("Expected Kit base");
    expect(
      game.asPlayerOne().playCard(kitCloudkickerSureShot, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(kitCloudkickerSureShot)).toBe(1);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWith(target)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(target)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

describe("Kit Sure Shot legality and paid entry", () => {
  it("rejects opposing Ward then permits friendly Ward for the pending damage", () => {
    const shield = createMockCharacter({
      id: "kit-ward",
      name: "Ward Target",
      cost: 1,
      willpower: 3,
      abilities: [ward],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: kitCloudkickerSureShot, isDrying: false }, shield], deck: 3 },
      { play: [shield], deck: 3 },
    );
    const enemy = game.findCardInstanceId(shield, "play", PLAYER_TWO);
    const ally = game.findCardInstanceId(shield, "play", PLAYER_ONE);
    if (!enemy || !ally) throw new Error("Expected Ward targets");
    expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWith(enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(enemy)).toBe(0);
    expect(game.asPlayerOne().respondWith(ally)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(ally)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("rejects a location without losing the pending character damage choice", () => {
    const location = createMockLocation({
      id: "kit-location",
      name: "Location",
      cost: 1,
      willpower: 5,
      moveCost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: kitCloudkickerSureShot, isDrying: false }], deck: 3 },
      { play: [location, target], deck: 3 },
    );
    expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(kitCloudkickerSureShot, { choiceIndex: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWith(location)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(location)).toBe(0);
    expect(game.asPlayerOne().respondWith(target)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(target)).toBe(1);
  });

  it("rejects a different-name friendly base and an opposing Kit without spending ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [kitCloudkickerSureShot], play: [target], inkwell: 3, deck: 3 },
      { play: [kitCloudkickerUnpredictableCourier], deck: 3 },
    );
    const wrongName = game.findCardInstanceId(target, "play", PLAYER_ONE);
    const opposing = game.findCardInstanceId(
      kitCloudkickerUnpredictableCourier,
      "play",
      PLAYER_TWO,
    );
    if (!wrongName || !opposing) throw new Error("Expected invalid Shift bases");
    for (const shiftTarget of [wrongName, opposing]) {
      expect(
        game
          .asPlayerOne()
          .playCard(kitCloudkickerSureShot, { cost: { cost: "shift", shiftTarget } }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
      expect(game.asPlayerOne().getCardZone(kitCloudkickerSureShot)).toBe("hand");
    }
  });

  it("paid entry costs five and remains Fresh Ink without granting a quest reward", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [kitCloudkickerSureShot], inkwell: 5, deck: 3 },
      { play: [{ card: target, exerted: true }], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(kitCloudkickerSureShot)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().quest(kitCloudkickerSureShot)).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(kitCloudkickerSureShot, target),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(kitCloudkickerSureShot)).toBe(false);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
