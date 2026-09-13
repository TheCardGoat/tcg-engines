import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hiss } from "./hiss.ts";

export const hissI18n = defineFamilyI18n(hiss, {
  en: {
    name: "Hiss",
    typeText: "Mystic Assassin Attack Reaction",
    text: (amount) =>
      `Target Assassin or Mystic attack action card gets +${amount}{p}. If you've pitched a blue card this turn, create a Slither in your hand.`,
  },
});
export const { red: hissRedI18n, yellow: hissYellowI18n, blue: hissBlueI18n } = hissI18n.cards;
