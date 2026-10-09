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
import { joustingMatch } from "./197-jousting-match";

const target = createMockCharacter({
  id: "jousting-target",
  name: "Joust Target",
  cost: 3,
  strength: 1,
  willpower: 12,
});

describe("Jousting Match", () => {
  it("deals 2 damage when paid with ink only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [joustingMatch],
        inkwell: joustingMatch.cost,
      },
      {
        play: [target],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(joustingMatch, { targets: [target] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: target, value: 2 });
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("deals 5 damage instead when an ink drop was removed to play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [joustingMatch],
        inkwell: joustingMatch.cost - 1,
        inkDrops: 1,
      },
      {
        play: [target],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(joustingMatch, { targets: [target], inkDrops: 1 }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: target, value: 5 });
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(0);
  });

  it("does not boost damage merely because unused ink drops are held", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 3, inkDrops: 2, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.playCard(joustingMatch, { targets: [target] })).toBeSuccessfulCommand();
    expect(player).toHaveDamage({ card: target, value: 2 });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getZonesCardCount().hand).toBe(0);
    expect(player.getZonesCardCount().discard).toBe(1);
  });

  it("replaces two damage with five when all three ink are paid with drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 0, inkDrops: 4, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(joustingMatch, { targets: [target], inkDrops: 3 }),
    ).toBeSuccessfulCommand();
    expect(player).toHaveDamage({ card: target, value: 5 });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player.getZonesCardCount().discard).toBe(1);
  });

  it("rejects a claimed drop that is not held even when ready ink covers the cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 3, inkDrops: 0, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(joustingMatch, { targets: [target], inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(player).toHaveDamage({ card: target, value: 0 });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(player.getZonesCardCount().hand).toBe(1);
    expect(player.getZonesCardCount().discard).toBe(0);
  });

  it("can damage a friendly Ward character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [joustingMatch],
      inkwell: 3,
      play: [aladdinPrinceAli],
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(joustingMatch, { targets: [aladdinPrinceAli] })).toBeSuccessfulCommand();
    expect(player.getCardZone(aladdinPrinceAli)).toBe("discard");
    expect(player.getZonesCardCount().play).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("rejects an opposing Ward target without spending ink or drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 2, inkDrops: 1, deck: [] },
      { play: [aladdinPrinceAli], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(joustingMatch, { targets: [aladdinPrinceAli], inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(aladdinPrinceAli)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(player.getZonesCardCount().hand).toBe(1);
    expect(player.getZonesCardCount().discard).toBe(0);
  });

  it("applies Resist to the ordinary two damage", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 3, deck: [] },
      { play: [{ card: balooFreightPilot, damage: 1 }], deck: [] },
    );
    expect(
      engine.asPlayerOne().playCard(joustingMatch, { targets: [balooFreightPilot] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(balooFreightPilot)).toBe(2);
    expect(engine.asPlayerTwo().getCardZone(balooFreightPilot)).toBe("play");
  });

  it("applies Resist after replacing two damage with five and banishes at four", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 2, inkDrops: 1, deck: [] },
      { play: [balooFreightPilot], deck: [] },
    );
    expect(
      engine.asPlayerOne().playCard(joustingMatch, { targets: [balooFreightPilot], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(balooFreightPilot)).toBe("discard");
    expect(engine.asPlayerTwo().getZonesCardCount().play).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("banishes a character when ordinary damage reaches its remaining willpower", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 3, deck: [] },
      { play: [{ card: target, damage: 10 }], deck: [] },
    );
    expect(
      engine.asPlayerOne().playCard(joustingMatch, { targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(target)).toBe("discard");
    expect(engine.asPlayerTwo().getZonesCardCount().play).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });

  it("rejects a location target without consuming payment", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 2, inkDrops: 1, deck: [] },
      { play: [bellesHouseMauricesWorkshop], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(joustingMatch, { targets: [bellesHouseMauricesWorkshop], inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getCardZone(bellesHouseMauricesWorkshop)).toBe("play");
  });

  it("rejects insufficient combined payment without damaging the target", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 1, inkDrops: 1, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(
      player.playCard(joustingMatch, { targets: [target], inkDrops: 1 }),
    ).not.toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getDamage(target)).toBe(0);
  });

  it("can be inked without dealing damage or removing drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [joustingMatch], inkwell: 2, inkDrops: 1, deck: [] },
      { play: [target], deck: [] },
    );
    const player = engine.asPlayerOne();
    expect(player.putIntoInkwell(PLAYER_ONE, joustingMatch)).toBeSuccessfulCommand();
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getCardZone(joustingMatch)).toBe("inkwell");
    expect(engine.asPlayerTwo().getDamage(target)).toBe(0);
    expect(player.getBagCount()).toBe(0);
  });

  it("uses Player Two's payment and deals five to Player One's character", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [target], inkwell: 4, inkDrops: 2, deck: 3 },
      { hand: [joustingMatch], inkwell: 2, inkDrops: 1, deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(
      player.playCard(joustingMatch, { targets: [target], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(target)).toBe(5);
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(player.getCardZone(joustingMatch)).toBe("discard");
    expect(player.getBagCount()).toBe(0);
  });
});
