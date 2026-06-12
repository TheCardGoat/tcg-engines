import type { ActionCard } from "@tcg/lorcana-types";
import { magicalManeuversI18n } from "./080-magical-maneuvers.i18n";

export const magicalManeuvers: ActionCard = {
  id: "9hd",
  canonicalId: "ci_9hd",
  reprints: ["set7-080"],
  cardType: "action",
  name: "Magical Maneuvers",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "007",
  cardNumber: 80,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a03dfd74bc3343a883df4bb71b193f0c",
    tcgPlayer: 618702,
  },
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "exert",
          },
        ],
        type: "sequence",
      },
      id: "1nx-1",
      text: "Return chosen character of yours to your hand. Exert chosen character.",
      type: "action",
    },
  ],
  i18n: magicalManeuversI18n,
};
