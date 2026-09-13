import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { twinTwisters } from "./twin-twisters.ts";

export const twinTwistersI18n = defineFamilyI18n(twinTwisters, {
  en: {
    name: "Twin Twisters",
    text: "When this hits, your next attack this combat chain gains +1{p}.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: twinTwistersRedI18n,
  yellow: twinTwistersYellowI18n,
  blue: twinTwistersBlueI18n,
} = twinTwistersI18n.cards;
