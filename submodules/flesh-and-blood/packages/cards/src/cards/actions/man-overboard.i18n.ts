import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { manOverboard } from "./man-overboard.ts";

export const manOverboardI18n = defineFamilyI18n(manOverboard, {
  en: {
    name: "Man Overboard",
    text: "When this attacks, you may discard an ally. If you do, this gets +1{p} and go again.",
    typeText: "Pirate Necromancer Action - Attack",
  },
});
export const {
  red: manOverboardRedI18n,
  yellow: manOverboardYellowI18n,
  blue: manOverboardBlueI18n,
} = manOverboardI18n.cards;
