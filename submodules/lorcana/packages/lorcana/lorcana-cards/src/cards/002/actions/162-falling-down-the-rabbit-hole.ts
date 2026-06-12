import type { ActionCard } from "@tcg/lorcana-types";
import { fallingDownTheRabbitHoleI18n } from "./162-falling-down-the-rabbit-hole.i18n";

export const fallingDownTheRabbitHole: ActionCard = {
  id: "kL9",
  canonicalId: "ci_kL9",
  reprints: ["set2-162"],
  cardType: "action",
  name: "Falling Down the Rabbit Hole",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 162,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_2a71e5ea621f41ce9028d6551c153764",
    tcgPlayer: 526208,
  },
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            exerted: true,
            facedown: true,
            source: "chosen-character",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "put-into-inkwell",
          },
          {
            chosenBy: "opponent",
            exerted: true,
            facedown: true,
            source: "chosen-character",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "put-into-inkwell",
          },
        ],
      },
    },
  ],
  i18n: fallingDownTheRabbitHoleI18n,
};
