import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theBareNecessitiesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Bare Necessities",
    text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
  },
  de: {
    name: "Probier's mal mit Gemütlichkeit",
    text: "Einer der gegnerischen Mitspielenden deiner Wahl zeigt alle Handkarten für alle sichtbar vor und wirft eine Karte deiner Wahl, die keine Charakterkarte ist, ab.",
  },
  fr: {
    name: "Il en faut peu pour être heureux",
    text: "Choisissez un adversaire, il révèle sa main et défausse une carte non-Personnage de votre choix.",
  },
  it: {
    name: "Lo Stretto Indispensabile",
    text: "(Un personaggio con costo 2 o superiore può per giocare questa canzone gratis.) Un avversario a tua scelta rivela la sua mano e scarta una carta non personaggio a tua scelta.",
  },
};
