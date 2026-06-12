import type { ItemCard } from "@tcg/lorcana-types";
import { coconutBasketI18n } from "./166-coconut-basket.i18n";

export const coconutBasket: ItemCard = {
  id: "dG9",
  canonicalId: "ci_eG9",
  reprints: ["set1-166", "set9-169"],
  cardType: "item",
  name: "Coconut Basket",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "001",
  cardNumber: 166,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a175d05b419e4250bd62273eeb6d48c5",
    tcgPlayer: 650103,
  },
  text: [
    {
      title: "CONSIDER THE COCONUT",
      description:
        "Whenever you play a character, you may remove up to 2 damage from chosen character.",
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
      id: "1d0-1",
      name: "CONSIDER THE COCONUT",
      text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: coconutBasketI18n,
};
