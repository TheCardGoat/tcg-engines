import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHornedKingWickedRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Horned King",
    version: "Wicked Ruler",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "ARISE!",
        description:
          "Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
      },
    ],
  },
  de: {
    name: "Der gehörnte König",
    version: "Boshafter Herrscher",
    text: [
      {
        title: "Gestaltwandel 2",
      },
      {
        title: "STEHT AUF!",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere durch eine Herausforderung verbannt wird, darfst du jene Karte zurück auf deine Hand nehmen. Wähle danach eine Karte aus deiner Hand und wirf sie ab.",
      },
    ],
  },
  fr: {
    name: "Le Seigneur des Ténèbres",
    version: "Monarque maléfique",
    text: [
      {
        title: "Alter 2",
      },
      {
        title: "LEVEZ-VOUS!",
        description:
          "Chaque fois que l'un de vos autres personnages est banni via un défi, vous pouvez le renvoyer dans votre main, puis défausser une carte.",
      },
    ],
  },
  it: {
    name: "Re Cornelius",
    version: "Sovrano Malvagio",
    text: [
      {
        title: "Trasformazione 2",
      },
      {
        title: "LEVATEVI!",
        description:
          "Ogni volta che uno dei tuoi altri personaggi viene esiliato in una sfida, puoi riprendere in mano quella carta, poi scegli e scarta una carta.",
      },
    ],
  },
};
