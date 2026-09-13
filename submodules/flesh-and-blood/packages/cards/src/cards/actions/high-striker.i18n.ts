import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { highStriker } from "./high-striker.ts";

export const highStrikerI18n = defineFamilyI18n(highStriker, {
  en: {
    name: "High Striker",
    typeText: "Generic Action",
    text: ({ tokenCount }) =>
      `The next time an attack you control hits this turn, create ${tokenCount} Copper tokens.\nGo again`,
  },
});

export const {
  red: highStrikerRedI18n,
  yellow: highStrikerYellowI18n,
  blue: highStrikerBlueI18n,
} = highStrikerI18n.cards;
