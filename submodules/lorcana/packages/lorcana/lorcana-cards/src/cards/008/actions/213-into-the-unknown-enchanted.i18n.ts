import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const intoTheUnknownEnchantedI18n: Record<Languages, I18nProperties> = {
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
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage épuisé et placez-le dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Quello Che non So",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Aggiungi un personaggio impegnato a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
      },
    ],
  },
};
