import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { packCall } from "./pack-call.ts";

export const packCallI18n = defineFamilyI18n(packCall, {
  en: {
    name: "Pack Call",
    text: "When this defends, reveal the top card of your deck. If it has 6 or more {p}, put it on top. Otherwise, put it on the bottom.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: packCallRedI18n,
  yellow: packCallYellowI18n,
  blue: packCallBlueI18n,
} = packCallI18n.cards;
