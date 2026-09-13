import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { backHeelKick } from "./back-heel-kick.ts";

export const backHeelKickI18n = defineFamilyI18n(backHeelKick, {
  en: {
    name: "Back Heel Kick",
    typeText: "Ninja Action - Attack",
    text: "Combo - If Twin Twisters was the last attack this combat chain, while this is face-up in any zone and would gain {p}, instead it gains that much plus 1.",
  },
});

export const {
  red: backHeelKickRedI18n,
  yellow: backHeelKickYellowI18n,
  blue: backHeelKickBlueI18n,
} = backHeelKickI18n.cards;
