import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mulch } from "./mulch.ts";

export const mulchI18n = defineFamilyI18n(mulch, {
  en: {
    name: "Mulch",
    text: 'Earth Fusion\nIf Mulch was fused, it gains "If this hits a hero, put a card from their arsenal on the bottom of their deck."',
    typeText: "Elemental Guardian Action - Attack",
  },
});

export const { red: mulchRedI18n, yellow: mulchYellowI18n, blue: mulchBlueI18n } = mulchI18n.cards;
