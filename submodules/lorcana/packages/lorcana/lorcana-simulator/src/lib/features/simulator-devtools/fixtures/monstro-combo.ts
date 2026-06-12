import { createFixture } from "./fixture-factory";
import { monstroInfamousWhale, donaldDuckCoinCollector } from "@tcg/lorcana-cards/cards/008";
import { theGreatIlluminaryAbandonedLaboratory } from "@tcg/lorcana-cards/cards/010";
import { alanadaleRockinRooster, weKnowTheWay } from "@tcg/lorcana-cards/cards/005";

export const monstroComboFixture = createFixture({
  id: "monstro-combo",
  name: "Monstro + Donald Duck Combo",
  description:
    "Test the FULL BREACH + COMBO shortcut. Player one has Monstro in play and Donald Duck in hand with enough ink to play. After playing Donald, Monstro should gain the combo shortcut ability.",
  skipPreGame: true,
  playerOne: {
    hand: [donaldDuckCoinCollector, weKnowTheWay],
    play: [monstroInfamousWhale, theGreatIlluminaryAbandonedLaboratory, alanadaleRockinRooster],
    inkwell: donaldDuckCoinCollector.cost,
    discard: [weKnowTheWay],
    deck: 20,
  },
  playerTwo: {
    deck: 10,
  },
});
