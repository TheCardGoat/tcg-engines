import { describe, expect, it } from "bun:test";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/130-dragon-fire";
import {
  cruellaDeVilStyleIcon,
  mulanInjuredSoldier,
  nalaUndauntedLioness,
  roxannePowerlineFan,
} from "~/game-engine/engines/lorcana/src/cards/definitions/009";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cruella De Vil - Style Icon", () => {
  it("OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: dragonFire.cost,
        play: [cruellaDeVilStyleIcon],
        hand: [dragonFire],
        deck: 5,
      },
      {
        play: [nalaUndauntedLioness],
      },
    );

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 5, inkwell: dragonFire.cost }),
    );

    await testEngine.playCard(
      dragonFire,
      { targets: [nalaUndauntedLioness] },
      true,
    );
    // await testEngine.resolveOptionalAbility();

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 4, inkwell: dragonFire.cost + 1 }),
    );
  });

  it("INSULTING REMARK During your turn, each opposing character with cost 2 or less gets...", async () => {
    const testEngine = new TestEngine(
      {
        play: [cruellaDeVilStyleIcon, mulanInjuredSoldier],
      },
      {
        play: [roxannePowerlineFan],
      },
    );

    expect(testEngine.getCardModel(mulanInjuredSoldier).strength).toEqual(
      mulanInjuredSoldier.strength,
    );
    expect(testEngine.getCardModel(roxannePowerlineFan).strength).toEqual(
      roxannePowerlineFan.strength - 1,
    );

    await testEngine.passTurn();

    expect(testEngine.getCardModel(roxannePowerlineFan).strength).toEqual(
      roxannePowerlineFan.strength,
    );
  });
});
