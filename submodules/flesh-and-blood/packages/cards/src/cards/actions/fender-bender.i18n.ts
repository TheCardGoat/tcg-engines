import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fenderBender } from "./fender-bender.ts";

export const fenderBenderI18n = defineFamilyI18n(fenderBender, {
  en: {
    name: "Fender Bender",
    text: "Boost\nThis gets +X{p}, where X is the number of equipment defending it.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: fenderBenderRedI18n,
  yellow: fenderBenderYellowI18n,
  blue: fenderBenderBlueI18n,
} = fenderBenderI18n.cards;
