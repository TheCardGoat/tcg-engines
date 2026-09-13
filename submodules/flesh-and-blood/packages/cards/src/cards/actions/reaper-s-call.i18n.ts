import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reaperSCall } from "./reaper-s-call.ts";

export const reaperSCallI18n = defineFamilyI18n(reaperSCall, {
  en: {
    name: "Reaper's Call",
    text: "Stealth\nInstant - Discard this: Mark target opposing hero.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: reaperSCallRedI18n,
  yellow: reaperSCallYellowI18n,
  blue: reaperSCallBlueI18n,
} = reaperSCallI18n.cards;
