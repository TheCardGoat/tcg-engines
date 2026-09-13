import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { isenhowlWeathervane } from "./isenhowl-weathervane.ts";

export const isenhowlWeathervaneI18n = defineFamilyI18n(isenhowlWeathervane, {
  en: {
    name: "Isenhowl Weathervane",
    text: (_parameter, color) =>
      `The next time you Ice fuse this turn, create ${color === "red" ? 2 : color === "yellow" ? 3 : 4} Frostbite tokens under target hero's control.\nGo again`,
    typeText: "Ice Action",
  },
});

export const {
  red: isenhowlWeathervaneRedI18n,
  yellow: isenhowlWeathervaneYellowI18n,
  blue: isenhowlWeathervaneBlueI18n,
} = isenhowlWeathervaneI18n.cards;
