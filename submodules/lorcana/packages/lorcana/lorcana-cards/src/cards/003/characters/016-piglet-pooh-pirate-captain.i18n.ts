import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pigletPoohPirateCaptainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Piglet",
    version: "Pooh Pirate Captain",
    text: [
      {
        title: "AND I'M THE CAPTAIN!",
        description:
          "While you have 2 or more other characters in play, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Ferkel",
    version: "Puuhs Piratenkapitän",
    text: [
      {
        title: "UND ICH BIN DER KAPITÄN!",
        description:
          "Solange du mindestens 2 weitere Charaktere im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Porcinet",
    version: "Capitaine pirate de Winnie",
    text: [
      {
        title: "ET JE SERAI LE CAPITAINE!",
        description:
          "Tant que vous avez au moins 2 autres personnages en jeu, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Pimpi",
    version: "Capitano del Pirata Pooh",
    text: [
      {
        title: "E IO SONO IL CAPITANO!",
        description: "Mentre hai altri 2 o più personaggi in gioco, questo personaggio riceve +2.",
      },
    ],
  },
};
