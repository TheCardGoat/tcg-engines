import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMousePirateLookout: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "location",
        },
        type: "optional",
      },
      id: "1hl-1",
      text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 120,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "c1342a66787eb3f74ae51488e7b16a4ad1776975",
  },
  fullName: "Minnie Mouse - Pirate Lookout",
  id: "1hl",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "006",
  strength: 3,
  text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
  version: "Pirate Lookout",
  willpower: 2,
};
