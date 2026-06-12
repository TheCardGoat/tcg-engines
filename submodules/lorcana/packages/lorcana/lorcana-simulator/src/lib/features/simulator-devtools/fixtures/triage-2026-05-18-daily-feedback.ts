import {
  befuddle,
  developYourBrain,
  hakunaMatata,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { pawpsicle } from "@tcg/lorcana-cards/cards/002";
import { mufasaRulerOfPrideRock, robinHoodSharpshooter } from "@tcg/lorcana-cards/cards/005";
import { megabot } from "@tcg/lorcana-cards/cards/006";
import { theBlackCauldron } from "@tcg/lorcana-cards/cards/010";
import { educationOrElimination } from "@tcg/lorcana-cards/cards/011";
import {
  daleReadyForHisShot,
  fireflySwarm,
  luisaMadrigalConfidentClimber,
} from "@tcg/lorcana-cards/cards/012";
import { createFixture } from "./fixture-factory";

export const triage20260518FireflySwarmChoiceFixture = createFixture({
  id: "triage-2026-05-18-firefly-swarm-choice",
  name: "Triage 2026-05-18 - Firefly Swarm choice target",
  description:
    "Daily feedback visual repro for Firefly Swarm. Play Firefly Swarm, choose the 2-strength-or-less branch, then Dale - Ready for His Shot should be selectable as the target instead of the prompt hanging.",
  skipPreGame: true,
  playerOne: {
    hand: [fireflySwarm, hakunaMatata, hakunaMatata],
    inkwell: fireflySwarm.cost + hakunaMatata.cost * 2,
    deck: [],
  },
  playerTwo: {
    play: [daleReadyForHisShot, mickeyMouseTrueFriend],
    deck: [],
  },
  seed: "triage-2026-05-18-firefly-swarm-choice",
});

export const triage20260518FireflySwarmDiscardMetricFixture = createFixture({
  id: "triage-2026-05-18-firefly-swarm-discard-metric",
  name: "Triage 2026-05-18 - Firefly Swarm discard metric",
  description:
    "Daily feedback visual repro for Firefly Swarm's second branch. Move two other cards from hand to discard this turn, play Firefly Swarm, then the 2+ discard branch should make a higher-strength character selectable and banishable.",
  skipPreGame: true,
  playerOne: {
    hand: [fireflySwarm, befuddle, developYourBrain],
    inkwell: fireflySwarm.cost,
    deck: [],
  },
  playerTwo: {
    play: [mickeyMouseTrueFriend],
    deck: [],
  },
  seed: "triage-2026-05-18-firefly-swarm-discard-metric",
});

export const triage20260518FireflySwarmRobinHoodFixture = createFixture({
  id: "triage-2026-05-18-firefly-swarm-robin-hood-free-play",
  name: "Triage 2026-05-18 - Firefly Swarm Robin Hood free play",
  description:
    "Replay mg92g0Tl2dnLSAwwrwbYHDw turn 8 repro. Quest Robin Hood - Sharpshooter, play Firefly Swarm for free from the scry, then Firefly's first mode should advance into target selection instead of inheriting the parent optional and going straight to discard.",
  skipPreGame: true,
  playerOne: {
    deck: [fireflySwarm, befuddle, developYourBrain, pawpsicle],
    play: [{ card: robinHoodSharpshooter, isDrying: false }],
  },
  playerTwo: {
    play: [daleReadyForHisShot, mickeyMouseTrueFriend],
    deck: [],
  },
  seed: "triage-2026-05-18-firefly-swarm-robin-hood-free-play",
});

export const triage20260518EducationOrEliminationChoiceFixture = createFixture({
  id: "triage-2026-05-18-education-or-elimination-choice",
  name: "Triage 2026-05-18 - Education or Elimination choice target",
  description:
    "Daily feedback visual repro for Education or Elimination. Play the song, choose the damaged-character banish branch, then the damaged opposing Simba should be selectable.",
  skipPreGame: true,
  playerOne: {
    hand: [educationOrElimination],
    inkwell: educationOrElimination.cost,
    deck: [],
  },
  playerTwo: {
    play: [{ card: simbaProtectiveCub, damage: 1 }, mickeyMouseTrueFriend],
    deck: [],
  },
  seed: "triage-2026-05-18-education-or-elimination-choice",
});

export const triage20260518MegaBotDestroyChoiceFixture = createFixture({
  id: "triage-2026-05-18-megabot-destroy-choice",
  name: "Triage 2026-05-18 - MegaBot DESTROY choice target",
  description:
    "Daily feedback visual repro for MegaBot. Activate DESTROY!, choose the damaged-character branch, then the damaged opposing Simba should be selectable after MegaBot pays its cost.",
  skipPreGame: true,
  playerOne: {
    play: [{ card: megabot, isDrying: false }],
    deck: [],
  },
  playerTwo: {
    play: [pawpsicle, { card: simbaProtectiveCub, damage: 1 }],
    deck: [],
  },
  seed: "triage-2026-05-18-megabot-destroy-choice",
});

export const triage20260518BlackCauldronMufasaFixture = createFixture({
  id: "triage-2026-05-18-black-cauldron-mufasa",
  name: "Triage 2026-05-18 - Black Cauldron Mufasa",
  description:
    "Daily feedback visual repro for The Black Cauldron. Activate RISE AND JOIN ME!, then Mufasa - Ruler of Pride Rock should be available to play from under the item with sufficient ink.",
  skipPreGame: true,
  playerOne: {
    inkwell: mufasaRulerOfPrideRock.cost + 1,
    play: [
      {
        card: theBlackCauldron,
        cardsUnder: [{ card: mufasaRulerOfPrideRock, publicFaceState: "faceUp" as const }],
      },
    ],
    deck: [],
  },
  playerTwo: {
    deck: [],
  },
  seed: "triage-2026-05-18-black-cauldron-mufasa",
});

export const triage20260518LuisaUndamagedSourceFixture = createFixture({
  id: "triage-2026-05-18-luisa-undamaged-source",
  name: "Triage 2026-05-18 - Luisa undamaged source",
  description:
    "Daily feedback visual repro for Luisa Madrigal - Confident Climber. Activate I CAN TAKE IT with Luisa already at 3 damage; the undamaged friendly Simba should still be selectable for the up-to-1 source step, then Luisa's damage can move to the opposing Mickey.",
  skipPreGame: true,
  playerOne: {
    inkwell: 1,
    play: [
      { card: luisaMadrigalConfidentClimber, isDrying: false, damage: 3 },
      { card: simbaProtectiveCub, isDrying: false },
    ],
    deck: [],
  },
  playerTwo: {
    play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
    deck: [],
  },
  seed: "triage-2026-05-18-luisa-undamaged-source",
});
