import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightenTheLoad } from "./lighten-the-load.ts";

export const lightenTheLoadI18n = defineFamilyI18n(lightenTheLoad, {
  en: {
    name: "Lighten the Load",
    text: "When this attacks, you may discard a card or destroy an item you control. If you do, this gets go again.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: lightenTheLoadRedI18n,
  yellow: lightenTheLoadYellowI18n,
  blue: lightenTheLoadBlueI18n,
} = lightenTheLoadI18n.cards;
