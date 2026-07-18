import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const emeraldChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Emerald Chromicon",
    text: [
      {
        title: "EMERALD LIGHT",
        description:
          "During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
      },
    ],
  },
  de: {
    name: "Smaragd Chromikon",
    text: [
      {
        title: "Smaragdfarbenes Licht",
        description:
          "Jedes Mal, wenn einer deiner Charaktere im Zug einer gegnerischen Person verbannt wird, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Émeraude",
    text: [
      {
        title: "Lueur d'émeraude",
        description:
          "Durant le tour de vos adversaires, chaque fois que l'un de vos personnages est banni, vous pouvez choisir un personnage et le renvoyer dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Cromicon di Smeraldo",
    text: [
      {
        title: "Luce di Smeraldo",
        description:
          "Durante il turno degli avversari, ogni volta che uno dei tuoi personaggi viene esiliato, puoi far riprendere in mano al suo giocatore un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Cromicon esmeralda",
    text: [
      {
        title: "LUZ ESMERALDA",
        description:
          "Durante los turnos de los oponentes, cada vez que uno de tus personajes sea desterrado, puedes devolver el personaje elegido a la mano de su jugador.",
      },
    ],
  },
};
