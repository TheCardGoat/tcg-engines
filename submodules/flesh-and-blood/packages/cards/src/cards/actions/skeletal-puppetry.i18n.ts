import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { skeletalPuppetry } from "./skeletal-puppetry.ts";

export const skeletalPuppetryI18n = defineFamilyI18n(skeletalPuppetry, {
  en: {
    name: "Skeletal Puppetry",
    typeText: "Necromancer Action",
    text: "You may discard an ally rather than pay this card's {r} cost.\nYour next ally attack this turn gets +3{p} and go again.\nGo again",
  },
});

export const {
  red: skeletalPuppetryRedI18n,
  yellow: skeletalPuppetryYellowI18n,
  blue: skeletalPuppetryBlueI18n,
} = skeletalPuppetryI18n.cards;
