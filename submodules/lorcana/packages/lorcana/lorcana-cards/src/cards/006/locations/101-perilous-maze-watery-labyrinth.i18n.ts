import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const perilousMazeWateryLabyrinthI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Perilous Maze",
    version: "Watery Labyrinth",
    text: [
      {
        title: "LOST IN THE WAVES",
        description:
          "Whenever a character is challenged while here, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Gefährliches Labyrinth",
    version: "Wasserlabyrinth",
    text: [
      {
        title: "VERLOREN IN DEN WELLEN",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort herausgefordert wird, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Labyrinthe périlleux",
    version: "Dédale aquatique",
    text: [
      {
        title: "PERDUS DANS LES VAGUES",
        description:
          "Chaque fois qu'un personnage sur ce lieu est défié, chaque adversaire défausse une carte de sa main au choix.",
      },
    ],
  },
  it: {
    name: "Labirinto Insidioso",
    version: "Dedalo Acquatico",
    text: [
      {
        title: "PERSI TRA LE ONDE",
        description:
          "Ogni volta che un personaggio viene sfidato mentre si trova in questo luogo, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
