import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dauntless } from "./dauntless.ts";

export const dauntlessI18n = defineFamilyI18n(dauntless, {
  en: {
    name: "Dauntless",
    text: (amount) =>
      `Your next weapon attack this turn gains +${amount}{p}.\nThe next defense reaction card the defending hero plays this turn costs an additional {r} to play.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: dauntlessRedI18n,
  yellow: dauntlessYellowI18n,
  blue: dauntlessBlueI18n,
} = dauntlessI18n.cards;
