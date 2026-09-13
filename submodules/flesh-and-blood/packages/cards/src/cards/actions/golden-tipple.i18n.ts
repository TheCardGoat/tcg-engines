import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { goldenTipple } from "./golden-tipple.ts";

export const goldenTippleI18n = defineFamilyI18n(goldenTipple, {
  en: {
    name: "Golden Tipple",
    text: "When this attacks, you may discard a yellow card. If you do, draw a card and create a Gold token.\nGo again",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: goldenTippleRedI18n,
  yellow: goldenTippleYellowI18n,
  blue: goldenTippleBlueI18n,
} = goldenTippleI18n.cards;
