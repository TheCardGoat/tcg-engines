import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pourTheMold } from "./pour-the-mold.ts";

export const pourTheMoldI18n = defineFamilyI18n(pourTheMold, {
  en: {
    name: "Pour the Mold",
    text: ({ value1 }) =>
      `Put a Mechanologist item with cost ${value1}${value1 === 0 ? "" : " or less"} from your hand into the arena.\nIf you have boosted this turn, put a steam counter on it.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: pourTheMoldRedI18n,
  yellow: pourTheMoldYellowI18n,
  blue: pourTheMoldBlueI18n,
} = pourTheMoldI18n.cards;
