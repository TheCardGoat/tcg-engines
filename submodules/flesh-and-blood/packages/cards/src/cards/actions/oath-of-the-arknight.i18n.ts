import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { oathOfTheArknight } from "./oath-of-the-arknight.ts";

export const oathOfTheArknightI18n = defineFamilyI18n(oathOfTheArknight, {
  en: {
    name: "Oath of the Arknight",
    text: (amount) =>
      `Your next Runeblade attack this turn gains +${amount}{p}.\nCreate a Runechant token.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: oathOfTheArknightRedI18n,
  yellow: oathOfTheArknightYellowI18n,
  blue: oathOfTheArknightBlueI18n,
} = oathOfTheArknightI18n.cards;
