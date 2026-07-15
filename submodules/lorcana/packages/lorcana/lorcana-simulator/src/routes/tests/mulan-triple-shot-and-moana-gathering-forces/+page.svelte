<script lang="ts">
  import { createFixture } from "@/features/simulator-devtools/fixtures/fixture-factory";
  import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";

  import { mulanEliteArcher } from "@tcg/lorcana-cards/cards/004";
  import {
    kakamoraBoardingParty,
    kakamoraLongrangeSpecialist,
    kakamoraPiratePitcher,
    moanaKakamoraLeader,
    flotillaCoconutArmada,
  } from "@tcg/lorcana-cards/cards/006";
  import {
    mickeyMouseTrueFriend,
    minnieMouseAlwaysClassy,
    grammaTalaStoryteller,
    heiheiBoatSnack,
  } from "@tcg/lorcana-cards/cards/001";

  // Combined validation fixture for two reported bugs:
  //
  // BUG A — Mulan - Elite Archer / TRIPLE SHOT
  //   Repro: challenge one of the exerted opponents with Mulan.
  //   Expected: prompt shows 2 "Deal damage to" slots (up to 2 other characters).
  //   Reported: only 1 target slot appears.
  //
  // BUG B — Moana - Kakamora Leader / GATHERING FORCES
  //   Repro: play Moana from hand.
  //   Expected: prompt lets you pick ANY NUMBER of your characters, then 1 location.
  //   Reported: only 1 character slot, then up to 5 location slots appear.
  const fixture = createFixture({
    id: "mulan-triple-shot-and-moana-gathering-forces",
    name: "Mulan Triple Shot + Moana Gathering Forces",
    description:
      "Two bugs in one board. (A) Challenge with Mulan — Triple Shot should show 2 target slots. (B) Play Moana from hand — Gathering Forces should let you pick multiple characters then 1 location.",
    playerOne: {
      play: [
        mulanEliteArcher,
        kakamoraBoardingParty,
        kakamoraLongrangeSpecialist,
        kakamoraPiratePitcher,
        flotillaCoconutArmada,
      ],
      hand: [moanaKakamoraLeader],
      inkwell: moanaKakamoraLeader.cost,
      deck: 10,
    },
    playerTwo: {
      play: [
        { card: mickeyMouseTrueFriend, exerted: true },
        { card: minnieMouseAlwaysClassy, exerted: true },
        grammaTalaStoryteller,
        heiheiBoatSnack,
      ],
      deck: 10,
    },
    skipPreGame: true,
  });
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
