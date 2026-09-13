import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { popTheBubble } from "./pop-the-bubble.ts";

export const popTheBubbleI18n = defineFamilyI18n(popTheBubble, {
  en: {
    name: "Pop the Bubble",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nSurge - If this deals more than 3 damage to a hero, destroy an aura permanent they control.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: popTheBubbleRedI18n,
  yellow: popTheBubbleYellowI18n,
  blue: popTheBubbleBlueI18n,
} = popTheBubbleI18n.cards;
