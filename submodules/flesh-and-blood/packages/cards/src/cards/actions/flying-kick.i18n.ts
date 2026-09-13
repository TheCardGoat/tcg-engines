import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flyingKick } from "./flying-kick.ts";

export const flyingKickI18n = defineFamilyI18n(flyingKick, {
  en: {
    name: "Flying Kick",
    typeText: "Ninja Action - Attack",
    text: "If this was played as chain link 3 or higher, it gets +2{p}.",
  },
});

export const {
  red: flyingKickRedI18n,
  yellow: flyingKickYellowI18n,
  blue: flyingKickBlueI18n,
} = flyingKickI18n.cards;
