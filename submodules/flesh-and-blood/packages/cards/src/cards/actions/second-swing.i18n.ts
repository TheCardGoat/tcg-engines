import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { secondSwing } from "./second-swing.ts";

export const secondSwingI18n = defineFamilyI18n(secondSwing, {
  en: {
    name: "Second Swing",
    text: ({
      value1,
    }) => `If you have attacked with a weapon this turn, your next attack this turn gains +${value1}{p}.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: secondSwingRedI18n,
  yellow: secondSwingYellowI18n,
  blue: secondSwingBlueI18n,
} = secondSwingI18n.cards;
