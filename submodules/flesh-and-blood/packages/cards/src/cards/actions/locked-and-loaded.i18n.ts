import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lockedAndLoaded } from "./locked-and-loaded.ts";

export const lockedAndLoadedI18n = defineFamilyI18n(lockedAndLoaded, {
  en: {
    name: "Locked and Loaded",
    text: ({ value1 }) =>
      `The next Mechanologist attack action card you play this turn gains +${value1}{p}.\nIf you have boosted this turn, opt 1.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: lockedAndLoadedRedI18n,
  yellow: lockedAndLoadedYellowI18n,
  blue: lockedAndLoadedBlueI18n,
} = lockedAndLoadedI18n.cards;
