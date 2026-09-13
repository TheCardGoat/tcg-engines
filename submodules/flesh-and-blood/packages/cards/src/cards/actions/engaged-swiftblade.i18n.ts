import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { engagedSwiftblade } from "./engaged-swiftblade.ts";

export const engagedSwiftbladeI18n = defineFamilyI18n(engagedSwiftblade, {
  en: {
    name: "Engaged Swiftblade",
    text: (amount) =>
      `Your next Warrior attack this turn gets +${amount}{p} and "If this is defended by an attack action card, this gets Go again."\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: engagedSwiftbladeRedI18n,
  yellow: engagedSwiftbladeYellowI18n,
  blue: engagedSwiftbladeBlueI18n,
} = engagedSwiftbladeI18n.cards;
