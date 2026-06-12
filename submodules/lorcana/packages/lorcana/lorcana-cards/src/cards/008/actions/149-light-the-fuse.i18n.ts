import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lightTheFuseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Light the Fuse",
    text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  },
  de: {
    name: "Entzünde die Lunte",
    text: "Zähle deine erschöpften Charaktere im Spiel. Füge einem Charakter deiner Wahl dieselbe Anzahl Schaden zu.",
  },
  fr: {
    name: "Mettre le feu aux poudres",
    text: "Choisissez un personnage et infligez-lui 1 dommage pour chacun de vos personnages épuisés en jeu.",
  },
  it: {
    name: "Accendere la Miccia",
    text: "Infliggi 1 danno a un personaggio a tua scelta per ogni personaggio impegnato che hai in gioco.",
  },
};
