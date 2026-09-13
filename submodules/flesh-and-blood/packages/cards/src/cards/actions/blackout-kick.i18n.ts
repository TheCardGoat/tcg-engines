import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blackoutKick } from "./blackout-kick.ts";

export const blackoutKickI18n = defineFamilyI18n(blackoutKick, {
  en: {
    name: "Blackout Kick",
    typeText: "Ninja Action - Attack",
    text: "Combo - If Rising Knee Thrust was the last attack this combat chain, Blackout Kick gains +3{p}.",
  },
});

export const {
  red: blackoutKickRedI18n,
  yellow: blackoutKickYellowI18n,
  blue: blackoutKickBlueI18n,
} = blackoutKickI18n.cards;
