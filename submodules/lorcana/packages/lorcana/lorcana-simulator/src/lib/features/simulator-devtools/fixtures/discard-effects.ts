import {
  basilUndercoverDetective,
  chipQuickThinker,
  elsaFierceProtector,
  geppettoSkilledCraftsman,
  jafarHighSultanOfLorcana,
  palaceGuardSpectralSentry,
  theWardrobePerceptiveFriend,
  televisionSet,
} from "@tcg/lorcana-cards/cards/008";
import {
  developYourBrain,
  dragonFire,
  friendsOnTheOtherSide,
  hakunaMatata,
  mickeyMouseTrueFriend,
} from "@tcg/lorcana-cards/cards/001";
import {
  andThenAlongCameZeus,
  aurelianGyrosensor,
  ursulaDeceiver,
} from "@tcg/lorcana-cards/cards/003";
import { amethystChromicon } from "@tcg/lorcana-cards/cards/005";
import { createFixture } from "./fixture-factory";
import { angelExperiment624 } from "@tcg/lorcana-cards/cards/011";

export const discardEffectsFixture = createFixture({
  id: "discard-effects",
  name: "Discard Effects",
  description:
    "Manual discard test bed covering reveal-and-choose discard, opponent-chosen discard, random discard, discard-as-cost, discard-any-number, and discard with a payoff from the discarded card.",
  skipPreGame: true,
  playerOne: {
    inkwell: 15,
    hand: [
      ursulaDeceiver,
      chipQuickThinker,
      palaceGuardSpectralSentry,
      televisionSet,
      aurelianGyrosensor,
      amethystChromicon,
      developYourBrain,
      friendsOnTheOtherSide,
    ],
    play: [
      { card: basilUndercoverDetective, isDrying: false },
      { card: geppettoSkilledCraftsman, isDrying: false },
      { card: theWardrobePerceptiveFriend, isDrying: false },
      { card: jafarHighSultanOfLorcana, isDrying: false },
      { card: elsaFierceProtector, isDrying: false },
      angelExperiment624,
    ],
    deck: [
      dragonFire,
      hakunaMatata,
      developYourBrain,
      friendsOnTheOtherSide,
      andThenAlongCameZeus,
      dragonFire,
    ],
    discard: [mickeyMouseTrueFriend],
  },
  playerTwo: {
    inkwell: 10,
    hand: [
      andThenAlongCameZeus,
      dragonFire,
      hakunaMatata,
      friendsOnTheOtherSide,
      mickeyMouseTrueFriend,
    ],
    play: [
      { card: mickeyMouseTrueFriend, isDrying: false },
      { card: palaceGuardSpectralSentry, isDrying: false },
    ],
    discard: [developYourBrain],
  },
});
