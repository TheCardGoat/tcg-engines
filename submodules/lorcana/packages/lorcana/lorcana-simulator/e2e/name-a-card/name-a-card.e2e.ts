import {
  lastditchEffort,
  divebomb,
  theSorcerersHat,
  _99Puppies,
} from "@tcg/lorcana-cards/cards/003";
import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
import {
  minnieMouseAlwaysClassy,
  mauiHeroToAll,
  mickeyMouseTrueFriend,
  reflection,
  hakunaMatata,
} from "@tcg/lorcana-cards/cards/001";
import {
  madamMimRivalOfMerlin,
  mouseArmor,
  theQueenCommandingPresence,
} from "@tcg/lorcana-cards/cards/002";
import { julietaMadrigalExcellentCook } from "@tcg/lorcana-cards/cards/009";
import {
  darkwingDuckCoolUnderPressure,
  donaldDuckAlongForTheRide,
} from "@tcg/lorcana-cards/cards/011";
import { test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  brunoMadrigalOutOfTheShadows,
  brunoMadrigalUndetectedUncle,
} from "@tcg/lorcana-cards/cards/004";
import {
  blastFromYourPast,
  moanaDeterminedExplorer,
  weKnowTheWay,
} from "@tcg/lorcana-cards/cards/005";
import { merlinCleverClairvoyant } from "@tcg/lorcana-cards/cards/007";

const PLAYER_ONE_VIEW = "playerOne" as const;

const NAME_A_CARD_FIXTURE = {
  id: "name-a-card",
  name: "Name a card",
  description: "Testing scenarios for cards that require naming a card",
  skipPreGame: true,
  playerOne: {
    inkwell: 20,
    hand: [weKnowTheWay, blastFromYourPast],
    play: [merlinCleverClairvoyant, theSorcerersHat, brunoMadrigalUndetectedUncle, mouseArmor],
    deck: [
      theQueenCommandingPresence,
      darkwingDuckCoolUnderPressure,
      donaldDuckAlongForTheRide,
      loseTheWay,
      reflection,
      brunoMadrigalOutOfTheShadows,
      hakunaMatata,
      moanaDeterminedExplorer,
      julietaMadrigalExcellentCook,
      _99Puppies,
      mauiHeroToAll,
      minnieMouseAlwaysClassy,
    ],
  },
  playerTwo: {
    hand: [mickeyMouseTrueFriend, divebomb, lastditchEffort],
    play: [madamMimRivalOfMerlin],
  },
} as const;

test.describe("Name a Card", () => {
  test("UI interactions to activate abilities", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixture: NAME_A_CARD_FIXTURE, view: PLAYER_ONE_VIEW });
  });
});
