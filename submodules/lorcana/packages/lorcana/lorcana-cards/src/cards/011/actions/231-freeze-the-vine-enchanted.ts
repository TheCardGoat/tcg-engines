import type { ActionCard } from "@tcg/lorcana-types";
import { freezeTheVineEnchantedI18n } from "./231-freeze-the-vine-enchanted.i18n";

export const freezeTheVineEnchanted: ActionCard = {
  id: "ubB",
  canonicalId: "ci_LB6",
  slug: "lorcana-ci_LB6",
  printings: [
    {
      id: "set11-231-enchanted",
      artId: "ci_LB6-enchanted",
      setCode: "set11",
      collectorNumber: "231",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-096"],
  cardType: "action",
  name: "Freeze the Vine",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0659baf8fad4748ae9abf7260279d8c",
    tcgPlayer: "675395",
  },
  text: "Banish all locations. Draw 2 cards, then choose and discard a card.",
  abilities: [
    {
      type: "action",
      text: "Banish all locations. Draw 2 cards, then choose and discard a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: freezeTheVineEnchantedI18n,
};
