import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { toweringTitan } from "./towering-titan.ts";

export const toweringTitanI18n = defineFamilyI18n(toweringTitan, {
  en: {
    name: "Towering Titan",
    text: (amount) =>
      `At the beginning of your action phase, destroy Towering Titan then the next Guardian attack action card you play this turn gains +${amount}{p}.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: toweringTitanRedI18n,
  yellow: toweringTitanYellowI18n,
  blue: toweringTitanBlueI18n,
} = toweringTitanI18n.cards;
