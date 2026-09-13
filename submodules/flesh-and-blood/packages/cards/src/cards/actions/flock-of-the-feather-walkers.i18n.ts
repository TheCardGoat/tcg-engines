import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flockOfTheFeatherWalkers } from "./flock-of-the-feather-walkers.ts";

export const flockOfTheFeatherWalkersI18n = defineFamilyI18n(flockOfTheFeatherWalkers, {
  en: {
    name: "Flock of the Feather Walkers",
    typeText: "Generic Action - Attack",
    text: "As an additional cost to play Flock of the Feather Walkers, reveal a card in your hand with cost 1 or less.\\nWhen you attack with Flock of the Feather Walkers, create a Quicken token.",
  },
});

export const {
  red: flockOfTheFeatherWalkersRedI18n,
  yellow: flockOfTheFeatherWalkersYellowI18n,
  blue: flockOfTheFeatherWalkersBlueI18n,
} = flockOfTheFeatherWalkersI18n.cards;
