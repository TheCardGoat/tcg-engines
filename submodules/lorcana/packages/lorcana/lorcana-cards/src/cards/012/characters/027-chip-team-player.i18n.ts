import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chipTeamPlayerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chip",
    version: "Team Player",
    text: [
      {
        title: "RANGER RESOURCEFULNESS",
        description:
          "When you play this character, if you have another character with 4 {W} or more in play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Chip",
    version: "Teamplayer",
    text: [
      {
        title: "Findigkeit der Ritter des Rechts",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren Charakter mit 4 oder mehr {W} im Spiel hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Tic",
    version: "Joue en équipe",
    text: [
      {
        title: "Débrouillardise du ranger",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage ayant 4 {W} ou plus en jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Cip",
    version: "Con Spirito di Squadra",
    text: [
      {
        title: "Intraprendenza da Agente Speciale",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio con 4 {W} o superiore, puoi pescare una carta.",
      },
    ],
  },
};
