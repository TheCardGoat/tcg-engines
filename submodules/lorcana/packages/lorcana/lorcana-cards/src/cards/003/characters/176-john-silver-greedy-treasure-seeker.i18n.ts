import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverGreedyTreasureSeekerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Greedy Treasure Seeker",
    text: [
      {
        title: "CHART YOUR OWN COURSE",
        description:
          "For each location you have in play, this character gains Resist +1 and gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Habgieriger Schatzsucher",
    text: [
      {
        title: "DEINEN KURS BESTIMMEN",
        description:
          "Für jeden Ort den du im Spiel hast, erhält dieser Charakter +1 und Robust +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Chasseur de trésor avide",
    text: [
      {
        title: "CHOISIS TOI-MÊME TON CAP",
        description:
          "Ce personnage gagne +1 et Résistance +1 pour chaque lieu que vous avez en jeu.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Avido Cacciatore di Tesori",
    text: [
      {
        title: "TRACCIARE LA TUA ROTTA",
        description:
          "Per ogni luogo che hai in gioco, questo personaggio ottiene Resistere +1 e riceve +1.",
      },
    ],
  },
};
