import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { havenVeil } from "./haven-veil.ts";

export const havenVeilI18n = defineFamilyI18n(havenVeil, {
  en: {
    name: "Haven Veil",
    typeText: "Wizard Instant - Aura",
    text: ({ amount }) =>
      `When this enters the arena, prevent the next ${amount} arcane damage that would be dealt to you this turn. At the beginning of your action phase, destroy this.`,
  },
});

export const {
  red: havenVeilRedI18n,
  yellow: havenVeilYellowI18n,
  blue: havenVeilBlueI18n,
} = havenVeilI18n.cards;
