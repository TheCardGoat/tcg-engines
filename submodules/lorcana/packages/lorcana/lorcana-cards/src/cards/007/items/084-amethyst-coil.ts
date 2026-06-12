import type { ItemCard } from "@tcg/lorcana-types";
import { amethystCoilI18n } from "./084-amethyst-coil.i18n";

export const amethystCoil: ItemCard = {
  id: "aGu",
  canonicalId: "ci_aGu",
  reprints: ["set7-084"],
  cardType: "item",
  name: "Amethyst Coil",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 84,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_e26f9abffd3943c096c50b0cef7425ff",
    tcgPlayer: 619451,
  },
  text: [
    {
      title: "MAGICAL TOUCH",
      description:
        "During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  abilities: [
    {
      id: "1uu-1",
      name: "MAGICAL TOUCH",
      type: "triggered",
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: 1,
          from: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "damaged",
              },
            ],
          },
          to: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
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
  i18n: amethystCoilI18n,
};
