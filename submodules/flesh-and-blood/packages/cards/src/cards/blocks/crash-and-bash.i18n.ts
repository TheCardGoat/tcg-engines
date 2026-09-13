import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crashAndBash } from "./crash-and-bash.ts";

export const crashAndBashI18n = defineFamilyI18n(crashAndBash, {
  en: {
    name: "Crash and Bash",
    text: "When this defends, you may reveal a card with crush from your hand. If you do, create a Seismic Surge token.",
    typeText: "Guardian Block",
  },
});

export const {
  red: crashAndBashRedI18n,
  yellow: crashAndBashYellowI18n,
  blue: crashAndBashBlueI18n,
} = crashAndBashI18n.cards;
