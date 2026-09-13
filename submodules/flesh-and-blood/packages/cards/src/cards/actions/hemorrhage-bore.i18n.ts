import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hemorrhageBore } from "./hemorrhage-bore.ts";

export const hemorrhageBoreI18n = defineFamilyI18n(hemorrhageBore, {
  en: {
    name: "Hemorrhage Bore",
    typeText: "Ranger Action - Arrow Attack",
    text: 'If Hemorrhage Bore has an aim counter, it has "When this hits a hero, destroy a card in their arsenal."',
  },
});

export const {
  red: hemorrhageBoreRedI18n,
  yellow: hemorrhageBoreYellowI18n,
  blue: hemorrhageBoreBlueI18n,
} = hemorrhageBoreI18n.cards;
