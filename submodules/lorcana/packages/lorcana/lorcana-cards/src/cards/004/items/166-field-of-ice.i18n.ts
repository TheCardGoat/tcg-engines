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
        title: "Eisige Verteidigung",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, erhält er bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Champ de Glace",
    text: [
      {
        title: "Défense glacée",
        description:
          "Chaque fois que vous jouez un personnage, il gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Distesa di Ghiaccio",
    text: [
      {
        title: "Difesa Glaciale",
        description:
          "Ogni volta che giochi un personaggio, ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Campo de hielo",
    text: [
      {
        title: "DEFENSA HELADA",
        description:
          "Siempre que juegas con un personaje, este obtiene Resistencia +1 hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
