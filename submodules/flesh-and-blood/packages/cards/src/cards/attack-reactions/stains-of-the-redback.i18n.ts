import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stainsOfTheRedback } from "./stains-of-the-redback.ts";

export const stainsOfTheRedbackI18n = defineFamilyI18n(stainsOfTheRedback, {
  en: {
    name: "Stains of the Redback",
    typeText: "Assassin Attack Reaction",
    text: (amount) =>
      `If the defending hero is marked, this costs {r} less to play. Target attack with stealth gets +${amount}{p} and go again.`,
  },
});
export const {
  red: stainsOfTheRedbackRedI18n,
  yellow: stainsOfTheRedbackYellowI18n,
  blue: stainsOfTheRedbackBlueI18n,
} = stainsOfTheRedbackI18n.cards;
