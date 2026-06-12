import type { ItemCard } from "@tcg/lorcana-types";
import { galacticCommunicatorI18n } from "./099-galactic-communicator.i18n";

export const galacticCommunicator: ItemCard = {
  id: "SR9",
  canonicalId: "ci_SR9",
  reprints: ["set6-099"],
  cardType: "item",
  name: "Galactic Communicator",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 99,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6d0654972afb4eb581136a391d3f967b",
    tcgPlayer: 588088,
  },
  text: [
    {
      title: "RESOURCE ALLOCATION 1",
      description:
        "{I}, Banish this item — Return chosen character with 2 {S} or less to their player's hand.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        type: "return-to-hand",
      },
      id: "q1z-1",
      name: "RESOURCE ALLOCATION 1",
      text: "RESOURCE ALLOCATION 1 {I}, Banish this item — Return chosen character with 2 {S} or less to their player's hand.",
      type: "activated",
    },
  ],
  i18n: galacticCommunicatorI18n,
};
