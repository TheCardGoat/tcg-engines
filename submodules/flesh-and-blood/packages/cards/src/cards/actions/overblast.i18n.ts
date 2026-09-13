import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overblast } from "./overblast.ts";

export const overblastI18n = defineFamilyI18n(overblast, {
  en: {
    name: "Overblast",
    text: "Overblast gains +X{p}, where X is the number of times you have boosted this combat chain.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: overblastRedI18n,
  yellow: overblastYellowI18n,
  blue: overblastBlueI18n,
} = overblastI18n.cards;
