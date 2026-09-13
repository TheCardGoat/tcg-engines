import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stonyWoottonhog } from "./stony-woottonhog.ts";

export const stonyWoottonhogI18n = defineFamilyI18n(stonyWoottonhog, {
  en: {
    name: "Stony Woottonhog",
    text: "While Stony Woottonhog is defended by less than 2 non-equipment cards, it has +1{p}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: stonyWoottonhogRedI18n,
  yellow: stonyWoottonhogYellowI18n,
  blue: stonyWoottonhogBlueI18n,
} = stonyWoottonhogI18n.cards;
