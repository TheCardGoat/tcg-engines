import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fieldOfIceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Field of Ice",
    text: [
      {
        title: "ICY DEFENSE",
        description:
          "Whenever you play a character, they gain Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Eisfläche",
    text: [
      {
        title: "EISIGE VERTEIDIGUNG",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält er bis zu Beginn deines nächsten Zuges Robust +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Champ de Glace",
    text: [
      {
        title: "DÉFENSE GLACÉE",
        description:
          "Chaque fois que vous jouez un personnage, il gagne Résistance +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Distesa di Ghiaccio",
    text: [
      {
        title: "DIFESA GLACIALE",
        description:
          "Ogni volta che giochi un personaggio, ottiene Resistere +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
