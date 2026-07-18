import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weveGotALotToDoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "We've Got a Lot to Do!",
    text: "Put chosen item or location into its player's inkwell facedown and exerted.",
  },
  de: {
    name: "Soviel der Lauferei",
    text: "Lege einen Gegenstand oder Ort deiner Wahl verdeckt und erschöpft in den zugehörigen Tintenvorrat.",
  },
  fr: {
    name: "En route et sauve qui peut !",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un objet ou un lieu et placez-le dans la réserve d'encre de son propriétaire, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Abbiamo un Po' da Far",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Aggiungi un oggetto o un luogo a tua scelta al calamaio del suo giocatore, a faccia in giù e impegnato.",
      },
    ],
  },
  es: {
    name: "¡Tenemos mucho que hacer!",
    text: "Coloque el elemento o ubicación elegido en el tintero de su jugador boca abajo y ejerza.",
  },
};
