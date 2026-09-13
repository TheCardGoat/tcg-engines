import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gasGuzzler } from "./gas-guzzler.ts";

export const gasGuzzlerI18n = defineFamilyI18n(gasGuzzler, {
  en: {
    name: "Gas Guzzler",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: gasGuzzlerRedI18n,
  yellow: gasGuzzlerYellowI18n,
  blue: gasGuzzlerBlueI18n,
} = gasGuzzlerI18n.cards;
