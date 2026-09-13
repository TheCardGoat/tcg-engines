import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tributeToTheLegionsOfDoom } from "./tribute-to-the-legions-of-doom.ts";

export const tributeToTheLegionsOfDoomI18n = defineFamilyI18n(tributeToTheLegionsOfDoom, {
  en: {
    name: "Tribute to the Legions of Doom",
    text: "As an additional cost to play this, banish a random card from your hand.\nIf a card with 6 or more {p} is banished this way, this gets +2{p}.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: tributeToTheLegionsOfDoomRedI18n,
  yellow: tributeToTheLegionsOfDoomYellowI18n,
  blue: tributeToTheLegionsOfDoomBlueI18n,
} = tributeToTheLegionsOfDoomI18n.cards;
