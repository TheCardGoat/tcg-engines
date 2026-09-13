import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rubbleRaiser } from "./rubble-raiser.ts";

export const rubbleRaiserI18n = defineFamilyI18n(rubbleRaiser, {
  en: {
    name: "Rubble Raiser",
    text: "Heave 2",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: rubbleRaiserRedI18n,
  yellow: rubbleRaiserYellowI18n,
  blue: rubbleRaiserBlueI18n,
} = rubbleRaiserI18n.cards;
