import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rumbleGrunting } from "./rumble-grunting.ts";

export const rumbleGruntingI18n = defineFamilyI18n(rumbleGrunting, {
  en: {
    name: "Rumble Grunting",
    text: (amount) =>
      `Play Rumble Grunting only if you've discarded a card with 6 or more {p} this turn.\nYour next Brute attack this turn gains +${amount}{p}.\nGo again`,
    typeText: "Brute Action",
  },
});

export const {
  red: rumbleGruntingRedI18n,
  yellow: rumbleGruntingYellowI18n,
  blue: rumbleGruntingBlueI18n,
} = rumbleGruntingI18n.cards;
