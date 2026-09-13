import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overpower } from "./overpower.ts";

export const overpowerI18n = defineFamilyI18n(overpower, {
  en: {
    name: "Overpower",
    typeText: "Warrior Attack Reaction",
    text: ({ normal, reprise }) =>
      `Target weapon attack gains +${normal}{p}. Reprise - If the defending hero has defended with a card from their hand this chain link, instead it gains +${reprise}{p}.`,
  },
});
export const {
  red: overpowerRedI18n,
  yellow: overpowerYellowI18n,
  blue: overpowerBlueI18n,
} = overpowerI18n.cards;
