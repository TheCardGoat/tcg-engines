import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { waterTheSeeds } from "./water-the-seeds.ts";

export const waterTheSeedsI18n = defineFamilyI18n(waterTheSeeds, {
  en: {
    name: "Water the Seeds",
    text: "When this attacks, your next attack this combat chain with 1 or less base {p} gets +1{p}.\nGo again",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: waterTheSeedsRedI18n,
  yellow: waterTheSeedsYellowI18n,
  blue: waterTheSeedsBlueI18n,
} = waterTheSeedsI18n.cards;
