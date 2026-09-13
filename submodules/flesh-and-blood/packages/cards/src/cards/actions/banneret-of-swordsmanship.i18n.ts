import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { banneretOfSwordsmanship } from "./banneret-of-swordsmanship.ts";

export const banneretOfSwordsmanshipI18n = defineFamilyI18n(banneretOfSwordsmanship, {
  en: {
    name: "Banneret of Swordsmanship",
    typeText: "Light Warrior Action - Attack",
    text: "Solflare - When this is charged to your soul, create a Flurry token.",
  },
});

export const { yellow: banneretOfSwordsmanshipYellowI18n } = banneretOfSwordsmanshipI18n.cards;
