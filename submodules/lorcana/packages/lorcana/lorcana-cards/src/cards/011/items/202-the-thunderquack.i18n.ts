import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theThunderquackI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Thunderquack",
    text: [
      {
        title: "VIGILANTE JUSTICE",
        description: "All opposing characters gain the Villain classification.",
      },
      {
        title: "LAY OF THE LAND",
        description: "{E} — If a character was banished in a challenge this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Der Donnerquack",
    text: [
      {
        title: "SELBSTJUSTIZ",
        description: "Alle gegnerischen Charaktere erhalten die Klassifizierung Schurke.",
      },
      {
        title: "LAGE DES LANDES",
        description:
          "— Falls in diesem Zug ein Charakter durch eine Herausforderung verbannt wurde, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Le Myster Quack",
    text: [
      {
        title: "LA JUSTICE DES JUSTICIERS",
        description: "Tous les personnages adverses gagnent la classification Méchant.",
      },
      {
        title: "RECONNAISSANCE DU TERRAIN",
        description:
          "— Si un personnage a été banni via un défi ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Il Thunderquack",
    text: [
      {
        title: "GIUSTIZIA DEL VIGILANTE",
        description: "Tutti i personaggi avversari ottengono la classificazione Cattivo.",
      },
      {
        title: "GIRO DI RICOGNIZIONE",
        description:
          "— Se un personaggio è stato esiliato in una sfida in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
};
