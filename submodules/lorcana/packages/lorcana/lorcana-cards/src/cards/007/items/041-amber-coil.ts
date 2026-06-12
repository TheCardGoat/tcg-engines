import type { ItemCard } from "@tcg/lorcana-types";
import { amberCoilI18n } from "./041-amber-coil.i18n";

export const amberCoil: ItemCard = {
  id: "I8y",
  canonicalId: "ci_I8y",
  reprints: ["set7-041"],
  cardType: "item",
  name: "Amber Coil",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 41,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_928bd23c4cdb4440898accbb73aba3bf",
    tcgPlayer: 619430,
  },
  text: [
    {
      title: "HEALING AURA",
      description:
        "During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 2 },
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "7an-1",
      name: "HEALING AURA",
      text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
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
  i18n: amberCoilI18n,
};
