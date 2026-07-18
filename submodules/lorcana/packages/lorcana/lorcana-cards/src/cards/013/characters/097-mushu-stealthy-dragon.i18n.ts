import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mushuStealthyDragonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mushu",
    version: "Stealthy Dragon",
    text: [
      {
        title: "<Evasive>",
      },
      {
        title: "Tip the Scales",
        description:
          "Whenever this character quests, if an opponent has more cards in their hand than you, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Mushu",
    version: "Verstohlener Drache",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Ausschlaggebend",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls mindestens eine gegnerische Person mehr Karten auf der Hand hat als du, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mushu",
    version: "Dragon furtif",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Faire pencher la balance",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si un adversaire a plus de cartes en main que vous, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Mushu",
    version: "Drago Silenzioso",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Spostare l'Ago della Bilancia",
        description:
          "Ogni volta che questo personaggio va all'avventura, se un avversario ha in mano più carte di te, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Mushu",
    version: "Dragón sigiloso",
    text: [
      {
        title: "<Evasivo>",
      },
      {
        title: "Inclinar el fiel de la balanza",
        description:
          "Siempre que este personaje realice una misión, si un oponente tiene más cartas en su mano que tú, puedes robar una carta.",
      },
    ],
  },
};
