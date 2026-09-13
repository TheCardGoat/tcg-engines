import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lifeOfTheParty } from "./life-of-the-party.ts";

export const lifeOfThePartyI18n = defineFamilyI18n(lifeOfTheParty, {
  en: {
    name: "Life of the Party",
    text: 'You may discard or destroy a card you control named Crazy Brew rather than pay Life of the Party\'s {r} cost. If you do, choose all modes, otherwise choose 1 at random;\n\nThis gets "When this hits, gain life 2{h}."\nThis gets +2{p}.\nThis gets go again.',
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: lifeOfThePartyRedI18n,
  yellow: lifeOfThePartyYellowI18n,
  blue: lifeOfThePartyBlueI18n,
} = lifeOfThePartyI18n.cards;
