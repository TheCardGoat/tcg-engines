import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hesATrampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "He's a Tramp",
    text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  },
  de: {
    name: "So ein Strolch",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +1 {S} für jeden deiner Charaktere im Spiel.",
  },
  fr: {
    name: "Il se traîne",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 1 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui gagne +1 {S} pour le reste de ce tour pour chaque personnage que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "È un Briccon",
    text: [
      {
        title:
          "(Un personaggio con costo 1 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta riceve +1 {S} per ogni personaggio che hai in gioco per questo turno.",
      },
    ],
  },
};
