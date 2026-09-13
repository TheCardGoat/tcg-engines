import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { debilitate } from "./debilitate.ts";

export const debilitateI18n = defineFamilyI18n(debilitate, {
  en: {
    name: "Debilitate",
    text: "Crush - When this deals 4 or more damage to a hero, their first attack during their next turn gets -2{p}.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: debilitateRedI18n,
  yellow: debilitateYellowI18n,
  blue: debilitateBlueI18n,
} = debilitateI18n.cards;
