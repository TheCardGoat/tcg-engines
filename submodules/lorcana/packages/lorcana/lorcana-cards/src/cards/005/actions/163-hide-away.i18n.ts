import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hideAwayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hide Away",
    text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  },
  de: {
    name: "Verstecken",
    text: "Lege einen Ort oder Gegenstand deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat.",
  },
  fr: {
    name: "Cachez-vous",
    text: "Choisissez un objet ou un lieu et placez-le dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
  },
  it: {
    name: "Nascondere",
    text: "Aggiungi un oggetto o un luogo a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
  },
};
