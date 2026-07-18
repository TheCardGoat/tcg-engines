import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const seldomAllTheySeemI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Seldom All They Seem",
    text: "Chosen character gets -3 {S} this turn.",
  },
  de: {
    name: "Ich weiß was geschieht",
    text: "Gib einem Charakter deiner Wahl in diesem Zug -3 {S}.",
  },
  fr: {
    name: "J'en ai Rêvé",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez un personnage qui subit -3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "È Tutta Illusione",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Un personaggio a tua scelta riceve -3 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Rara vez todo lo que parecen",
    text: "El personaje elegido obtiene -3 {S} este turno.",
  },
};
