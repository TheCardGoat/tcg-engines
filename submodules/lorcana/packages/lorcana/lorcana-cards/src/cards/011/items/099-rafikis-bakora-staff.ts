import type { ItemCard } from "@tcg/lorcana-types";
import { rafikisBakoraStaffI18n } from "./099-rafikis-bakora-staff.i18n";

export const rafikisBakoraStaff: ItemCard = {
  id: "GU7",
  canonicalId: "ci_GU7",
  reprints: ["set11-099"],
  cardType: "item",
  name: "Rafiki's Bakora Staff",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "011",
  cardNumber: 99,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b33671b3938940708ac2a4f7d00d942b",
    tcgPlayer: 675392,
  },
  text: [
    {
      title: "READ THE OMENS",
      description: "{E}, 1 {I} — Draw a card, then choose and discard a card.",
    },
    {
      title: "BONK! 1",
      description: "{I}, Banish this item — Deal 1 damage to chosen character.",
    },
  ],
  abilities: [
    {
      id: "fvr-1",
      name: "READ THE OMENS",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
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
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      text: "READ THE OMENS {E}, 1 {I} — Draw a card, then choose and discard a card.",
    },
    {
      id: "fvr-2",
      name: "BONK! 1",
      type: "activated",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      text: "BONK! 1 {I}, Banish this item — Deal 1 damage to chosen character.",
    },
  ],
  i18n: rafikisBakoraStaffI18n,
};
