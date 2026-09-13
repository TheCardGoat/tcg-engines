import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfOccult } from "./blessing-of-occult.ts";

export const blessingOfOccultI18n = defineFamilyI18n(blessingOfOccult, {
  en: {
    name: "Blessing of Occult",
    text: (count) =>
      `At the start of your turn, destroy Blessing of Occult then create ${count === 1 ? "a" : count} Runechant token${count === 1 ? "" : "s"}.`,
    typeText: "Runeblade Action - Aura",
  },
});

export const {
  red: blessingOfOccultRedI18n,
  yellow: blessingOfOccultYellowI18n,
  blue: blessingOfOccultBlueI18n,
} = blessingOfOccultI18n.cards;
