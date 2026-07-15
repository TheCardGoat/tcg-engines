<script lang="ts">
  import { createFixture } from "@/features/simulator-devtools/fixtures/fixture-factory";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";

  import {
    mickeyMouseTrueFriend,
    minnieMouseAlwaysClassy,
    mauiHeroToAll,
  } from "@tcg/lorcana-cards/cards/001";
  import { madamMimRivalOfMerlin, theQueenCommandingPresence } from "@tcg/lorcana-cards/cards/002";
  import { divebomb, lastditchEffort } from "@tcg/lorcana-cards/cards/003";
  import { loseTheWay } from "@tcg/lorcana-cards/cards/006";
  import { powerlineWorldsGreatestRockStar } from "@tcg/lorcana-cards/cards/009";
  import {
    darkwingDuckCoolUnderPressure,
    donaldDuckAlongForTheRide,
  } from "@tcg/lorcana-cards/cards/011";

  const fixture = createFixture({
    id: "multi-target",
    name: "Multi Target",
    description: "Exercises multi-target simulator interactions.",
    playerOne: {
      inkwell: 20,
      hand: [divebomb, loseTheWay, lastditchEffort, mickeyMouseTrueFriend],
      play: [
        minnieMouseAlwaysClassy,
        theQueenCommandingPresence,
        mauiHeroToAll,
        { card: donaldDuckAlongForTheRide, exerted: true },
      ],
    },
    playerTwo: {
      play: [
        madamMimRivalOfMerlin,
        darkwingDuckCoolUnderPressure,
        powerlineWorldsGreatestRockStar,
      ],
    },
    skipPreGame: true,
  });
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
