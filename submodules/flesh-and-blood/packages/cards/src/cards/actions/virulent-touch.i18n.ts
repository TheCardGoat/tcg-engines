import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { virulentTouch } from "./virulent-touch.ts";

export const virulentTouchI18n = defineFamilyI18n(virulentTouch, {
  en: {
    name: "Virulent Touch",
    text: `Virulent Touch can't be played from hand.
When this chain link resolves, if Virulent Touch is defended by a card from hand, create a Bloodrot Pox token under the defending hero's control.`,
    typeText: "Assassin / Ranger Action - Attack",
  },
});

export const {
  red: virulentTouchRedI18n,
  yellow: virulentTouchYellowI18n,
  blue: virulentTouchBlueI18n,
} = virulentTouchI18n.cards;
