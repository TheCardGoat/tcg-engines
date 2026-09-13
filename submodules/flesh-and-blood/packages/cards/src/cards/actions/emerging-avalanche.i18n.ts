import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { emergingAvalanche } from "./emerging-avalanche.ts";

export const emergingAvalancheI18n = defineFamilyI18n(emergingAvalanche, {
  en: {
    name: "Emerging Avalanche",
    text: "Ice Fusion\nGo again\nWhen Emerging Avalanche enters the arena, if it was fused, create a Frostbite token under target hero control.\nAt the beginning of your action phase, destroy Emerging Avalanche then the next attack action card you play this turn gains +3{p}.",
    typeText: "Elemental Guardian Action - Aura",
  },
});
export const {
  red: emergingAvalancheRedI18n,
  yellow: emergingAvalancheYellowI18n,
  blue: emergingAvalancheBlueI18n,
} = emergingAvalancheI18n.cards;
