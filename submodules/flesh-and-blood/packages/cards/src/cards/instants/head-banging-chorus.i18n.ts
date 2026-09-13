import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { headBangingChorus } from "./head-banging-chorus.ts";

export const headBangingChorusI18n = defineFamilyI18n(headBangingChorus, {
  en: {
    name: "Head Banging Chorus",
    typeText: "Revered Guardian Instant - Aura",
    text: 'Suspense\nThe first Guardian or Revered attack action card you play each turn gets "When this hits a hero, if you have no cards in hand, draw a card."',
  },
});

export const { yellow: headBangingChorusYellowI18n } = headBangingChorusI18n.cards;
