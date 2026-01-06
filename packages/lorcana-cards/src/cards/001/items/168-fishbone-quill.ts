import type { ItemCard } from "@tcg/lorcana-types/cards/card-types";

export const fishboneQuill: ItemCard = {
  id: "k4a",
  cardType: "item",
  name: "Fishbone Quill",
  version: "",
  fullName: "Fishbone Quill",
  inkType: [
    "sapphire",
  ],
  franchise: "General",
  set: "001",
  text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
  cost: 3,
  cardNumber: 168,
  inkable: true,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 508830,
  },
  abilities: [
    {
      type: "activated",
      cost: {
          exert: true,
        },
      effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
      name: "Go Ahead And Sign",
      id: "k4a-1",
      text: "Put any card from your hand into your inkwell facedown.",
    },
  ],
};
