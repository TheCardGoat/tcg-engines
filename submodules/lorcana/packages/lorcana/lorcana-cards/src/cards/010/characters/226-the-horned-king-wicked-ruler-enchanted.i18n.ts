import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHornedKingWickedRulerEnchantedI18n: Record<Languages, I18nProperties> = {
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
        title:
          "<Gestaltwandel> 2 {I} (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Der-gehörnte-König-Charaktere auszuspielen.)",
      },
      {
        title: "Steht auf!",
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
        title: "<Alter> 2 {I}",
      },
      {
        title: "Levez-vous!",
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
        title: "<Trasformazione> 2 {I}",
      },
      {
        title: "Levatevi!",
        description:
          "Ogni volta che uno dei tuoi altri personaggi viene esiliato in una sfida, puoi riprendere in mano quella carta, poi scegli e scarta una carta.",
      },
    ],
  },
  es: {
    name: "El rey cornudo",
    version: "Gobernante malvado",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "¡SURGIR!",
        description:
          "Siempre que uno de tus otros personajes sea desterrado en un desafío, puedes devolver esa carta a tu mano, luego elegir y descartar una carta.",
      },
    ],
  },
};
