import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riseAbove } from "./rise-above.ts";

export const riseAboveI18n = defineFamilyI18n(riseAbove, {
  en: {
    name: "Rise Above",
    text: "You may put a card from your hand on top of your deck rather than pay Rise Above's {r} cost.",
    typeText: "Generic Defense Reaction",
  },
});

export const {
  red: riseAboveRedI18n,
  yellow: riseAboveYellowI18n,
  blue: riseAboveBlueI18n,
} = riseAboveI18n.cards;
