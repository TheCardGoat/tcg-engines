import type { ItemCard } from "@tcg/lorcana-types";
import { sapphireCoilI18n } from "./179-sapphire-coil.i18n";

export const sapphireCoil: ItemCard = {
  id: "jrq",
  canonicalId: "ci_jrq",
  reprints: ["set7-179"],
  cardType: "item",
  name: "Sapphire Coil",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 179,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3f99d55a6a434a00b6e547ec30e48a69",
    tcgPlayer: 619510,
  },
  text: [
    {
      title: "BRILLIANT SHINE",
      description:
        "During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
    },
  ],
  abilities: [
    {
      id: "1qw-1",
      name: "BRILLIANT SHINE",
      type: "triggered",
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: -2,
          duration: "this-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "BRILLIANT SHINE During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
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
    },
  ],
  i18n: sapphireCoilI18n,
};
