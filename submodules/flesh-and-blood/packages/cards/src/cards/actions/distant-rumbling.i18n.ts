import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { distantRumbling } from "./distant-rumbling.ts";

export const distantRumblingI18n = defineFamilyI18n(distantRumbling, {
  en: {
    name: "Distant Rumbling",
    text: (
      amount,
    ) => `When this enters the arena, draw a card, then put a card from your hand into your deck fifth from the top.
At the start of your turn, destroy this, then create ${amount} Seismic Surge tokens.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: distantRumblingRedI18n,
  yellow: distantRumblingYellowI18n,
  blue: distantRumblingBlueI18n,
} = distantRumblingI18n.cards;
