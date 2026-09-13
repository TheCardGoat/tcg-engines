import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeTheUpperHand } from "./take-the-upper-hand.ts";

export const takeTheUpperHandI18n = defineFamilyI18n(takeTheUpperHand, {
  en: {
    name: "Take the Upper Hand",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Play this only if you've wagered this chain link.\nTarget attack gets +${amount}{p}.`,
  },
});
export const {
  red: takeTheUpperHandRedI18n,
  yellow: takeTheUpperHandYellowI18n,
  blue: takeTheUpperHandBlueI18n,
} = takeTheUpperHandI18n.cards;
