import type { ItemCard } from "@tcg/lorcana-types";
import { upgradedChemPurseI18n } from "./169-upgraded-chem-purse.i18n";

export const upgradedChemPurse: ItemCard = {
  id: "E31",
  canonicalId: "ci_E31",
  slug: "lorcana-ci_E31",
  printings: [
    {
      id: "set14-169",
      artId: "set14-169",
      setCode: "set14",
      collectorNumber: "169",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-169"],
  cardType: "item",
  name: "Upgraded Chem Purse",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 169,
  rarity: "rare",
  cost: 2,
  inkable: true,
  abilities: [
    {
      id: "E31-1",
      name: "IT'S GOT POCKETS!",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
        banishItem: true,
        banishItemTarget: "another",
      },
      effect: {
        type: "scry",
        amount: 4,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "item",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      text: "IT'S GOT POCKETS! {E}, 1 {I}, Banish one of your other items — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  externalIds: {
    lorcast: "crd_182d0618dfb84eeea0f7d2b03f02afc9",
  },
  text: [
    {
      title: "IT'S GOT POCKETS!",
      description:
        "{E}, 1 {I}, Banish one of your other items — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: upgradedChemPurseI18n,
};
