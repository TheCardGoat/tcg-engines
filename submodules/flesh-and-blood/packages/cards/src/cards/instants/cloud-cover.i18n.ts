import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cloudCover } from "./cloud-cover.ts";

export const cloudCoverI18n = defineFamilyI18n(cloudCover, {
  en: {
    name: "Cloud Cover",
    typeText: "Lightning Instant",
    text: (amount) =>
      `The next time you would be dealt damage this turn, prevent ${amount} of that damage.`,
  },
});

export const {
  red: cloudCoverRedI18n,
  yellow: cloudCoverYellowI18n,
  blue: cloudCoverBlueI18n,
} = cloudCoverI18n.cards;
