import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dashParrLavaRunnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dash Parr",
    version: "Lava Runner",
    text: [
      {
        title: "Rush",
      },
      {
        title: "RECORD TIME",
        description: "This character can quest the turn he's played.",
      },
    ],
  },
  de: {
    name: "Flash Parr",
    version: "Lava-Läufer",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Rekordzeit",
        description: "Dieser Charakter kann im selben Zug erkunden, in dem er ausgespielt wird.",
      },
    ],
  },
  fr: {
    name: "Flèche Parr",
    version: "Court sur la lave",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Temps record",
        description: "Ce personnage peut être envoyé à l'aventure le tour où il est joué.",
      },
    ],
  },
  it: {
    name: "Flash Parr",
    version: "Corridore su Lava",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Tempo Record",
        description:
          "Questo personaggio può andare all'avventura nel turno in cui è stato giocato.",
      },
    ],
  },
};
