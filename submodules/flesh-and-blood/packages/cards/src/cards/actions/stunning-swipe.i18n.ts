import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stunningSwipe } from "./stunning-swipe.ts";

export const stunningSwipeI18n = defineFamilyI18n(stunningSwipe, {
  en: {
    name: "Stunning Swipe",
    text: 'Quickstrike - If this has go again, it gets "When this attacks a hero, deal 1 arcane damage to them."\nThe first time this deals damage to a Lightning hero, {t} them or a weapon they control.',
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: stunningSwipeRedI18n,
  yellow: stunningSwipeYellowI18n,
  blue: stunningSwipeBlueI18n,
} = stunningSwipeI18n.cards;
