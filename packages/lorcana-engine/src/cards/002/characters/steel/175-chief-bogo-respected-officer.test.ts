/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  chiefBogoRespectedOfficer,
  herculesDivineHero,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Chief Bogo- Respected Officer", () => {
  it("**INSUBORDINATION!** Whenever you play a Floodborn character, deal 1 damage to each opposing character.", () => {
    const testStore = new TestStore(
      {
        inkwell: herculesDivineHero.cost,
        hand: [herculesDivineHero],
        play: [chiefBogoRespectedOfficer],
      },
      {
        play: [liloGalacticHero],
      },
    );

    const floodbornChar = testStore.getByZoneAndId(
      "hand",
      herculesDivineHero.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      liloGalacticHero.id,
      "player_two",
    );

    floodbornChar.playFromHand();

    expect(target.damage).toEqual(1);
  });
});

describe("Regression tests", () => {
  it("Doesn't trigger opponent's bogo abilitiy when playing a floodborn", () => {
    const testStore = new TestStore(
      {
        inkwell: herculesDivineHero.cost,
        hand: [herculesDivineHero],
        play: [chiefBogoRespectedOfficer],
      },
      {
        play: [liloGalacticHero, chiefBogoRespectedOfficer],
      },
    );

    const floodbornChar = testStore.getByZoneAndId(
      "hand",
      herculesDivineHero.id,
    );
    const target = testStore.getCard(liloGalacticHero);
    const opponentBogo = testStore.getByZoneAndId(
      "play",
      chiefBogoRespectedOfficer.id,
      "player_two",
    );

    floodbornChar.playFromHand();

    expect(target.damage).toEqual(1);
    expect(opponentBogo.damage).toEqual(1);
  });
});
