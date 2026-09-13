import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { snowUnder } from "./snow-under.ts";

export const snowUnderI18n = defineFamilyI18n(snowUnder, {
  en: {
    name: "Snow Under",
    text: 'Ice Fusion\nIf Snow Under was fused, it gains "If this hits a hero, create a Frostbite token under their control."',
    typeText: "Elemental Guardian Action - Attack",
  },
});

export const {
  red: snowUnderRedI18n,
  yellow: snowUnderYellowI18n,
  blue: snowUnderBlueI18n,
} = snowUnderI18n.cards;
