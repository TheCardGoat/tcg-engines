import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfSerenity } from "./blessing-of-serenity.ts";

export const blessingOfSerenityI18n = defineFamilyI18n(blessingOfSerenity, {
  en: {
    name: "Blessing of Serenity",
    typeText: "Guardian Instant",
    text: (amount) =>
      `The next time your hero would be dealt {p} damage this turn, prevent ${amount} damage that source would deal.`,
  },
});

export const {
  red: blessingOfSerenityRedI18n,
  yellow: blessingOfSerenityYellowI18n,
  blue: blessingOfSerenityBlueI18n,
} = blessingOfSerenityI18n.cards;
