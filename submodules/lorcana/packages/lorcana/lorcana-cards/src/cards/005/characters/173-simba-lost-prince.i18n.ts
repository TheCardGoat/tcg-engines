import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaLostPrinceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Lost Prince",
    text: [
      {
        title: "FACE THE PAST",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Simba",
    version: "Verschollener Prinz",
    text: [
      {
        title: "DER VERGANGENHEIT STELLEN",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Simba",
    version: "Prince perdu",
    text: [
      {
        title: "FAIRE FACE À MON PASSÉ",
        description:
          "Durant votre tour, chaque fois que ce personnage en bannit un autre via un défi, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Principe Smarrito",
    text: [
      {
        title: "AFFRONTARE IL PASSATO",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, puoi pescare una carta.",
      },
    ],
  },
};
