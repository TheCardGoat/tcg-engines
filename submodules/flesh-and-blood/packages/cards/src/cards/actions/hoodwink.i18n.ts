import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hoodwink } from "./hoodwink.ts";

export const hoodwinkI18n = defineFamilyI18n(hoodwink, {
  en: {
    name: "Hoodwink",
    typeText: "Reviled Action - Attack",
    text: "Instant - Discard this and any number of other cards: Prevent the next X arcane damage that would be dealt to you this turn, where X is the total base {d} of cards discarded this way.",
  },
});

export const { blue: hoodwinkBlueI18n } = hoodwinkI18n.cards;
