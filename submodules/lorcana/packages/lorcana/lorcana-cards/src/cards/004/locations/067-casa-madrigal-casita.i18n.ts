import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const casaMadrigalCasitaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Casa Madrigal",
    version: "Casita",
    text: [
      {
        title: "OUR HOME",
        description: "At the start of your turn, if you have a character here gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Casa Madrigal",
    version: "Casita",
    text: [
      {
        title: "UNSER ZUHAUSE",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Charakter an diesem Ort hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Casa Madrigal",
    version: "Casita",
    text: [
      {
        title: "NOTRE MAISON",
        description:
          "Au début de votre tour, si vous avez un personnage sur ce lieu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Casa Madrigal",
    version: "Casita",
    text: [
      {
        title: "CASA NOSTRA",
        description:
          "All'inizio del tuo turno, se hai un personaggio in questo luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
