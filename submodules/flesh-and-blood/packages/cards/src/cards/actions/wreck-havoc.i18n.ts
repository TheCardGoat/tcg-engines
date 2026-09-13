import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wreckHavoc } from "./wreck-havoc.ts";

export const wreckHavocI18n = defineFamilyI18n(wreckHavoc, {
  en: {
    name: "Wreck Havoc",
    text: "Defense reactions can't be played to this chain link.\nWhen this hits a hero, you may turn a card in their arsenal face up, then destroy a defense reaction in their arsenal.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: wreckHavocRedI18n,
  yellow: wreckHavocYellowI18n,
  blue: wreckHavocBlueI18n,
} = wreckHavocI18n.cards;
