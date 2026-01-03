import type { ItemCard } from "@tcg/lorcana-types";

export const FishboneQuillUndefined: ItemCard = {
  id: "k4a",
  cardType: "item",
  name: "Fishbone Quill",
  version: "undefined",
  fullName: "Fishbone Quill - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
  cost: 3,
  cardNumber: 168,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**GO AHEAD AND SIGN** {E} − Put any card from your hand into your inkwell facedown.",
      id: "k4a-1",
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "CONTROLLER",
        facedown: true,
      },
    },
  ],
};
