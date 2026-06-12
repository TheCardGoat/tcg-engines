import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const intoTheUnknownI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Into the Unknown",
    text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
  },
  de: {
    name: "Wo noch niemand war",
    text: "Lege einen erschöpften Charakter deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat.",
  },
  fr: {
    name: "Dans un autre monde",
    text: "Choisissez un personnage épuisé et placez-le dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
  },
  it: {
    name: "Quello Che non So",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Aggiungi un personaggio impegnato a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
  },
};
