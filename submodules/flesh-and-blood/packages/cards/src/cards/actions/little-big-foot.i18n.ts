import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { littleBigFoot } from "./little-big-foot.ts";

export const littleBigFootI18n = defineFamilyI18n(littleBigFoot, {
  en: {
    name: "Little Big Foot",
    text: "If there are two or more cards with cost 3 or more in your pitch zone, this gets +6{p}.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: littleBigFootRedI18n,
  yellow: littleBigFootYellowI18n,
  blue: littleBigFootBlueI18n,
} = littleBigFootI18n.cards;
