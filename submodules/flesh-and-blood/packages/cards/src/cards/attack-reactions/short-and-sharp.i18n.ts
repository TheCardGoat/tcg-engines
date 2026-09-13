import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shortAndSharp } from "./short-and-sharp.ts";

export const shortAndSharpI18n = defineFamilyI18n(shortAndSharp, {
  en: {
    name: "Short and Sharp",
    typeText: "Assassin / Ninja Attack Reaction",
    text: (amount) =>
      `Choose 1;\n- Target dagger attack gains +${amount}{p}.\n- Target attack action card with 2 or less base {p} gains +${amount}{p}.`,
  },
});
export const {
  red: shortAndSharpRedI18n,
  yellow: shortAndSharpYellowI18n,
  blue: shortAndSharpBlueI18n,
} = shortAndSharpI18n.cards;
