<script lang="ts">
  import { createFixture } from "@/features/simulator-devtools/fixtures/fixture-factory";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";
  import {
    grumpySoreheadedMiner,
    meridaFormidableArcher,
    princeEricNobleSwordsman,
    threeArrows,
  } from "@tcg/lorcana-cards/cards/012";
  import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
  import { grabYourSword } from "@tcg/lorcana-cards/cards/001";

  const fixture = createFixture({
    id: "merida-steady-aim-three-arrows",
    name: "Merida Steady Aim + Three Arrows",
    description:
      "Visual validation for Merida - Formidable Archer's STEADY AIM. Play Three Arrows, choose Prince Eric first, then accept the optional second hit on Grumpy. Expected damage after all triggers resolve: Prince Eric has 4 damage, Grumpy has 3 damage.",
    playerOne: {
      inkwell: threeArrows.cost + mosquitoBite.cost + grabYourSword.cost,
      hand: [threeArrows, mosquitoBite, grabYourSword],
      play: [meridaFormidableArcher],
      deck: 10,
    },
    playerTwo: {
      play: [princeEricNobleSwordsman, grumpySoreheadedMiner],
      deck: 10,
    },
    skipPreGame: true,
  });
</script>

<svelte:head>
  <title>Merida Steady Aim + Three Arrows Test</title>
</svelte:head>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
