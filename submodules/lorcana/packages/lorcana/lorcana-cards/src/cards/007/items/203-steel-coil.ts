import type { ItemCard } from "@tcg/lorcana-types";
import { steelCoilI18n } from "./203-steel-coil.i18n";

export const steelCoil: ItemCard = {
  id: "02J",
  canonicalId: "ci_02J",
  reprints: ["set7-203"],
  cardType: "item",
  name: "Steel Coil",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 203,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9733c3ea959643178de845a528ff915c",
    tcgPlayer: 619525,
  },
  text: [
    {
      title: "METALLIC FLOW",
      description:
        "During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
        type: "optional",
      },
      id: "1y9-1",
      name: "METALLIC FLOW",
      text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: steelCoilI18n,
};
