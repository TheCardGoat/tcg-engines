import { bellesHouseMauricesWorkshop } from "../../003/locations/168-belles-house-maurices-workshop";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { balooFreightPilot } from "../characters/191-baloo-freight-pilot";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { inkExplosion } from "./198-ink-explosion";

const target = createMockCharacter({
  id: "ink-explosion-target",
  name: "Blast Target",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Ink Explosion", () => {
  it("deals 4 damage to the chosen character and gives the controller 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [inkExplosion],
        inkwell: inkExplosion.cost,
      },
      {
        play: [target],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(inkExplosion, { targets: [target] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: target, value: 4 });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("spends an existing drop before gaining the new drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 3, inkDrops: 1, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(inkExplosion, { targets: [target], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(target)).toBe(4);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getCardZone(inkExplosion)).toBe("discard");
  });

  it("cannot use the future drop to pay an insufficient cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 3, inkDrops: 0, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(inkExplosion, { targets: [target] })).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(target)).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getCardZone(inkExplosion)).toBe("hand");
  });

  it("still gains a drop after lethal damage to a friendly Ward character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkExplosion],
      inkwell: 4,
      inkDrops: 2,
      play: [aladdinPrinceAli],
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(inkExplosion, { targets: [aladdinPrinceAli] })).toBeSuccessfulCommand();
    expect(player.getCardZone(aladdinPrinceAli)).toBe("discard");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getZonesCardCount().discard).toBe(2);
  });

  it("does not gain a drop when an opposing Ward target is rejected", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 4, inkDrops: 2, deck: [] },
      { play: [aladdinPrinceAli], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(inkExplosion, { targets: [aladdinPrinceAli] }),
    ).not.toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(player.getCardZone(inkExplosion)).toBe("hand");
    expect(engine.asPlayerTwo().getDamage(aladdinPrinceAli)).toBe(0);
  });

  it("gains its drop when Resist reduces damage to three", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 4, deck: [] },
      { play: [balooFreightPilot], deck: [] },
    );
    expect(
      engine.asPlayerOne().playCard(inkExplosion, { targets: [balooFreightPilot] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(balooFreightPilot)).toBe(3);
    expect(engine.asPlayerTwo().getCardZone(balooFreightPilot)).toBe("play");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("gives the drop to Player Two when Player Two plays it", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [target], inkwell: 3, inkDrops: 2, deck: 3 },
      { hand: [inkExplosion], inkwell: 4, inkDrops: 1, deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(player.playCard(inkExplosion, { targets: [target] })).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(target)).toBe(4);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("gains a drop even when Resist prevents all four damage", () => {
    const protectedTarget = createMockCharacter({
      id: "ink-explosion-resist-four",
      name: "Protected Target",
      cost: 4,
      strength: 1,
      willpower: 6,
      abilities: [{ type: "keyword", keyword: "Resist", value: 4 }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 4, deck: [] },
      { play: [protectedTarget], deck: [] },
    );
    expect(
      engine.asPlayerOne().playCard(inkExplosion, { targets: [protectedTarget] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(protectedTarget)).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(protectedTarget)).toBe("play");
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().getCardZone(inkExplosion)).toBe("discard");
  });

  it("rejects a location without dealing damage or gaining a drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 4, deck: [] },
      { play: [bellesHouseMauricesWorkshop], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(inkExplosion, { targets: [bellesHouseMauricesWorkshop] }),
    ).not.toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getCardZone(inkExplosion)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(bellesHouseMauricesWorkshop)).toBe("play");
  });

  it("can pay all four ink with existing drops and then gain one", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 0, inkDrops: 4, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(inkExplosion, { targets: [target], inkDrops: 4 }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(target)).toBe(4);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getCardZone(inkExplosion)).toBe("discard");
  });

  it("cannot be put into the inkwell", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [inkExplosion], inkwell: 4, inkDrops: 2, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.putIntoInkwell(PLAYER_ONE, inkExplosion)).not.toBeSuccessfulCommand();
    expect(player.getCardZone(inkExplosion)).toBe("hand");
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerTwo().getDamage(target)).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });
});
