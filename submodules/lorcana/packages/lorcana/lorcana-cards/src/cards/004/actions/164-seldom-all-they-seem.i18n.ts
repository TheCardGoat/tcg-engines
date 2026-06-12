import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const seldomAllTheySeemI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Seldom All They Seem",
    text: "Chosen character gets -3 {S} this turn.",
  },
  de: {
    name: "Ich weiß was geschieht",
    text: "Gib einem Charakter deiner Wahl in diesem Zug -3.",
  },
  fr: {
    name: "J'en ai Rêvé",
    text: "Choisissez un personnage qui subit -3 pour le reste de ce tour.",
  },
  it: {
    name: "È Tutta Illusione",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta riceve -3 per questo turno.",
  },
};
