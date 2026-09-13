import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { packHunt } from "./pack-hunt.ts";

export const packHuntI18n = defineFamilyI18n(packHunt, {
  en: {
    name: "Pack Hunt",
    text: "When this attacks, intimidate.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: packHuntRedI18n,
  yellow: packHuntYellowI18n,
  blue: packHuntBlueI18n,
} = packHuntI18n.cards;
