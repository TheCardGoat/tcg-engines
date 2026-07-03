import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dellasMoonLullabyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Della's Moon Lullaby",
    text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
  },
  de: {
    name: "Dellas Schlaflied",
    text: "Gib einem gegnerischen Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}. Ziehe 1 Karte.",
  },
  fr: {
    name: "Berceuse de la Lune de Della",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage adverse qui subit -2 {S} jusqu'au début de votre prochain tour. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Ninna Nanna Lunare di Della",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio avversario a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno. Pesca una carta.",
      },
    ],
  },
};
