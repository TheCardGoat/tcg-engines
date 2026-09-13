import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { glyphOverlay } from "./glyph-overlay.ts";

export const glyphOverlayI18n = defineFamilyI18n(glyphOverlay, {
  en: {
    name: "Glyph Overlay",
    text: "Deal X+3 arcane damage to target hero, where X is the number of aura permanents you control with Sigil in their name.\nSurge - If this deals more than 3 damage, gain 1{h}, then shuffle all aura permanents you control with Sigil in their name into their owner's deck.",
    typeText: "Wizard Action",
  },
});

export const {
  red: glyphOverlayRedI18n,
  yellow: glyphOverlayYellowI18n,
  blue: glyphOverlayBlueI18n,
} = glyphOverlayI18n.cards;
