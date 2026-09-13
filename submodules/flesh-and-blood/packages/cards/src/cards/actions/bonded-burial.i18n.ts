import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bondedBurial } from "./bonded-burial.ts";

export const bondedBurialI18n = defineFamilyI18n(bondedBurial, {
  en: {
    name: "Bonded Burial",
    typeText: "Necromancer Action - Attack",
    text: "When this hits a hero, you may destroy an ally you control or discard an ally. If you do, they discard a card.",
  },
});

export const {
  red: bondedBurialRedI18n,
  yellow: bondedBurialYellowI18n,
  blue: bondedBurialBlueI18n,
} = bondedBurialI18n.cards;
