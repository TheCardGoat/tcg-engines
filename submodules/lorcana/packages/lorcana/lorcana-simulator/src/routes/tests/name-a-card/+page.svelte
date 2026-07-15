<script lang="ts">
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import {createFixture} from "@/features/simulator-devtools/fixtures/fixture-factory";
  import {_99Puppies, divebomb, iagoPrettyPolly, lastditchEffort, theSorcerersHat} from "@tcg/lorcana-cards/cards/003";
  import {loseTheWay} from "@tcg/lorcana-cards/cards/006";
  import {
      hakunaMatata,
      mauiHeroToAll,
      mickeyMouseTrueFriend,
      minnieMouseAlwaysClassy, reflection
  } from "@tcg/lorcana-cards/cards/001";
  import {madamMimRivalOfMerlin, mouseArmor, theQueenCommandingPresence} from "@tcg/lorcana-cards/cards/002";
  import {darkwingDuckCoolUnderPressure, donaldDuckAlongForTheRide} from "@tcg/lorcana-cards/cards/011";
  import {
      coconutBasket, dumboNinthWonderOfTheUniverse,
      julietaMadrigalExcellentCook,
  } from "@tcg/lorcana-cards/cards/009";
  import {merlinCleverClairvoyant, } from "@tcg/lorcana-cards/cards/007";
  import {
      blastFromYourPast, moanaDeterminedExplorer,
   weKnowTheWay
  } from "@tcg/lorcana-cards/cards/005";
  import {brunoMadrigalOutOfTheShadows, brunoMadrigalUndetectedUncle,} from "@tcg/lorcana-cards/cards/004";

  const fixture = createFixture({
      id: "name-a-card",
      name: "Name a card",
      description: "Testing scenarios for cards that require naming a card",
      skipPreGame: true,
      playerOne: {
          inkwell: 20,
          hand: [weKnowTheWay,blastFromYourPast],
          play: [iagoPrettyPolly, dumboNinthWonderOfTheUniverse,merlinCleverClairvoyant,theSorcerersHat, brunoMadrigalUndetectedUncle, mouseArmor],
          deck: [theQueenCommandingPresence,darkwingDuckCoolUnderPressure,donaldDuckAlongForTheRide,loseTheWay,reflection, brunoMadrigalOutOfTheShadows,hakunaMatata, moanaDeterminedExplorer, julietaMadrigalExcellentCook ,_99Puppies,mauiHeroToAll,minnieMouseAlwaysClassy]
      },
      playerTwo: {
          hand: [mickeyMouseTrueFriend,divebomb,lastditchEffort],
          play: [
              {card: madamMimRivalOfMerlin, exerted: true},
          ],
      },
  });
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
