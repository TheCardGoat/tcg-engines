import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flicFlak } from "./flic-flak.ts";

export const flicFlakI18n = defineFamilyI18n(flicFlak, {
  en: {
    name: "Flic Flak",
    text: "If the next card you defend with this turn is a card with combo, it gains +2{d}.",
    typeText: "Ninja Defense Reaction",
  },
});

export const {
  red: flicFlakRedI18n,
  yellow: flicFlakYellowI18n,
  blue: flicFlakBlueI18n,
} = flicFlakI18n.cards;
