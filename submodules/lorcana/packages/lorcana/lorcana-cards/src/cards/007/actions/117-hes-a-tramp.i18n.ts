import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hesATrampI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "He's a Tramp",
    text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  },
  de: {
    name: "So ein Strolch",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +1 für jeden deiner Charaktere im Spiel.",
  },
  fr: {
    name: "Il se traîne",
    text: "Choisissez un personnage qui gagne +1 pour le reste de ce tour pour chaque personnage que vous avez en jeu.",
  },
  it: {
    name: "È un Briccon",
    text: "(Un personaggio con costo 1 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta riceve +1 per ogni personaggio che hai in gioco per questo turno.",
  },
};
