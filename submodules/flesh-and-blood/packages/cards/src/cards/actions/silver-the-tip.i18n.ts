import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { silverTheTip } from "./silver-the-tip.ts";

export const silverTheTipI18n = defineFamilyI18n(silverTheTip, {
  en: {
    name: "Silver the Tip",
    text: ({
      textValue1,
    }) => `If you have no cards in your arsenal, look at the top ${textValue1} cards of your deck. You may put an arrow card from among them face up into your arsenal, then put the rest on the bottom of your deck in any order.
Go again`,
    typeText: "Ranger Action",
  },
});

export const {
  red: silverTheTipRedI18n,
  yellow: silverTheTipYellowI18n,
  blue: silverTheTipBlueI18n,
} = silverTheTipI18n.cards;
