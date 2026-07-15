import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const begoneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Begone!",
    text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
  },
  de: {
    name: "Hinfort!",
    text: "Schicke einen gegnerischen Charakter, Gegenstand oder Ort deiner Wahl, der 3 oder weniger kostet, auf die zugehörige Hand zurück.",
  },
  fr: {
    name: "Ouste !",
    text: "Choisissez un objet, un lieu ou un personnage coûtant 3 ou moins et renvoyez-le dans la main de son propriétaire.",
  },
  it: {
    name: "Sparisci!",
    text: "Fai riprendere in mano al suo giocatore un personaggio, un oggetto o un luogo a tua scelta con costo 3 o inferiore.",
  },
};
