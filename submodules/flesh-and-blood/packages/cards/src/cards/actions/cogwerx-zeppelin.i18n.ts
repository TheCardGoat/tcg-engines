import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cogwerxZeppelin } from "./cogwerx-zeppelin.ts";

export const cogwerxZeppelinI18n = defineFamilyI18n(cogwerxZeppelin, {
  en: {
    name: "Cogwerx Zeppelin",
    text: "When this hits a hero, you may {t} a cog you control. If you do, create a Golden Cog token.\nTwice per Turn Instant - {t} a cog you control: This gets +1{p}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: cogwerxZeppelinRedI18n,
  yellow: cogwerxZeppelinYellowI18n,
  blue: cogwerxZeppelinBlueI18n,
} = cogwerxZeppelinI18n.cards;
