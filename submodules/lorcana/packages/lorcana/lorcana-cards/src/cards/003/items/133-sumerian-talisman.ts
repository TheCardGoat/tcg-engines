import type { ItemCard } from "@tcg/lorcana-types";
import { sumerianTalismanI18n } from "./133-sumerian-talisman.i18n";

export const sumerianTalisman: ItemCard = {
  id: "zQ8",
  canonicalId: "ci_zQ8",
  reprints: ["set3-133"],
  cardType: "item",
  name: "Sumerian Talisman",
  inkType: ["ruby"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 133,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_890de7a0c3e34c8da80430d86a27365c",
    tcgPlayer: 536271,
  },
  text: [
    {
      title: "SOURCE OF MAGIC",
      description:
        "During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
    },
  ],
  abilities: [
    {
      id: "xe8-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "SOURCE OF MAGIC",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "in-challenge",
          },
        ],
      },
      type: "triggered",
      text: "SOURCE OF MAGIC During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
    },
  ],
  i18n: sumerianTalismanI18n,
};
