import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const signedContractI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Signed Contract",
    text: [
      {
        title: "FINE PRINT",
        description: "Whenever an opponent plays a song, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Unterschriebener Vertrag",
    text: [
      {
        title: "KLEINGEDRUCKTES",
        description:
          "Jedes Mal, wenn eine gegnerische Person ein Lied spielt, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Contrat signé",
    text: [
      {
        title: "PETITS CARACTÈRES",
        description:
          "Chaque fois qu'un adversaire joue une chanson, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Contratto Firmato",
    text: [
      {
        title: "CLAUSOLE IN PICCOLO",
        description: "Ogni volta che un avversario gioca una canzone, puoi pescare una carta.",
      },
    ],
  },
};
