import type { ItemCard } from "@tcg/lorcana-types";
import { ingeniousDeviceI18n } from "./201-ingenious-device.i18n";

export const ingeniousDevice: ItemCard = {
  id: "iZ1",
  canonicalId: "ci_iZ1",
  reprints: ["set10-201"],
  cardType: "item",
  name: "Ingenious Device",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 201,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_415b89e575ba4ce289709dfd16d4ff14",
    tcgPlayer: 659410,
  },
  text: [
    {
      title: "SURPRISE PACKAGE",
      description: "{E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
    },
    {
      title: "TIME GROWS SHORT",
      description:
        "During your turn, when this item is banished, deal 3 damage to chosen character or location.",
    },
  ],
  abilities: [
    {
      id: "12e-1",
      text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
      name: "SURPRISE PACKAGE",
      type: "activated",
      cost: {
        banishSelf: true,
        exert: true,
        ink: 2,
      },
      effect: {
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
        type: "sequence",
      },
    },
    {
      id: "12e-2",
      text: "TIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
      name: "TIME GROWS SHORT",
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          cardTypes: ["character", "location"],
          count: 1,
          selector: "chosen",
          zones: ["play"],
        },
      },
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      sourceZones: ["play", "discard"],
      type: "triggered",
    },
  ],
  i18n: ingeniousDeviceI18n,
};
