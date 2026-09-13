import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { widowmaker } from "./widowmaker.ts";

export const widowmakerI18n = defineFamilyI18n(widowmaker, {
  en: {
    name: "Widowmaker",
    text: ({
      textValue1,
      textValue2,
    }) => `Defense reactions can't be played to Widowmaker's chain link.
If Widowmaker is defended by fewer than ${textValue1} cards, it has +${textValue2}{p}.`,
    typeText: "Ranger Action - Arrow Attack",
  },
});

export const {
  red: widowmakerRedI18n,
  yellow: widowmakerYellowI18n,
  blue: widowmakerBlueI18n,
} = widowmakerI18n.cards;
