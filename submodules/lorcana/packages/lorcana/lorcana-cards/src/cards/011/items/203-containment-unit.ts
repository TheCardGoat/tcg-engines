import type { ItemCard } from "@tcg/lorcana-types";
import { containmentUnitI18n } from "./203-containment-unit.i18n";

export const containmentUnit: ItemCard = {
  id: "uei",
  canonicalId: "ci_uei",
  reprints: ["set11-203"],
  cardType: "item",
  name: "Containment Unit",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 203,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1d63cf69c7e24c3dabc4475484568e70",
    tcgPlayer: 676251,
  },
  text: [
    {
      title: "GOT YOU NOW",
      description:
        "When you play this item, choose a character. They can't challenge or quest while this item is in play.",
    },
    {
      title: "POWER SUPPLY",
      description: "At the start of your turn, choose and discard a card or banish this item.",
    },
  ],
  abilities: [
    {
      id: "1bl-1",
      name: "GOT YOU NOW",
      text: "GOT YOU NOW When you play this item, choose a character. They can't challenge or quest while this item is in play.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      effect: {
        duration: "permanent",
        linkedToSource: true,
        restriction: "cant-quest-or-challenge",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "restriction",
      },
    },
    {
      id: "1bl-2",
      name: "POWER SUPPLY",
      text: "POWER SUPPLY At the start of your turn, choose and discard a card or banish this item.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
      effect: {
        type: "or",
        optionLabels: ["choose and discard a card", "banish this item"],
        options: [
          {
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
          {
            target: "THIS_ITEM",
            type: "banish",
          },
        ],
      },
    },
  ],
  i18n: containmentUnitI18n,
};
