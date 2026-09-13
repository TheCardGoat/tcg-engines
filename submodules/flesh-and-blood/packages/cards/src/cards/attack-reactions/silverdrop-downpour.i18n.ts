import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { silverdropDownpour } from "./silverdrop-downpour.ts";

export const silverdropDownpourI18n = defineFamilyI18n(silverdropDownpour, {
  en: {
    name: "Silverdrop Downpour",
    typeText: "Warrior Attack Reaction",
    text: (amount) => {
      return `Target weapon attack gets +${amount}{p}.\nIf the weapon has been sharpened this turn, this costs {r} less to play.`;
    },
  },
});

export const {
  red: silverdropDownpourRedI18n,
  yellow: silverdropDownpourYellowI18n,
  blue: silverdropDownpourBlueI18n,
} = silverdropDownpourI18n.cards;
