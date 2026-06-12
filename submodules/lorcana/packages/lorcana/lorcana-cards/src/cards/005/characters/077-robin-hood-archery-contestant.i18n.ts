import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodArcheryContestantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Archery Contestant",
    text: [
      {
        title: "TRICK SHOT",
        description:
          "When you play this character, if an opponent has a damaged character in play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Teilnehmer am Wettbewerb im Bogenschießen",
    text: [
      {
        title: "TRICKSCHUSS",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens eine gegnerische Person einen beschädigten Charakter im Spiel hat, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Concurrent au tir à l'arc",
    text: [
      {
        title: "FLÈCHE FOURBE",
        description:
          "Lorsque vous jouez ce personnage, si un adversaire a un personnage ayant au moins un dommage sur lui, gagnez un éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Concorrente di Tiro con l'Arco",
    text: [
      {
        title: "COLPO DA MAESTRO",
        description:
          "Quando giochi questo personaggio, se un avversario ha in gioco un personaggio danneggiato, ottieni 1 leggenda.",
      },
    ],
  },
};
