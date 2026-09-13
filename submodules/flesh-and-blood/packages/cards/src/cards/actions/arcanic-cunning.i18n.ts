import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcanicCunning } from "./arcanic-cunning.ts";

export const arcanicCunningI18n = defineFamilyI18n(arcanicCunning, {
  en: {
    name: "Arcanic Cunning",
    text: "While this is attacking, defending, or on the stack, if you would be dealt arcane damage, prevent 1 of that damage.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: arcanicCunningRedI18n,
  yellow: arcanicCunningYellowI18n,
  blue: arcanicCunningBlueI18n,
} = arcanicCunningI18n.cards;
