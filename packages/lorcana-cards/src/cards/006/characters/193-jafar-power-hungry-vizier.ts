import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarPowerhungryVizier: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1w6-1",
      name: "YOU WILL BE PAID WHEN THE TIME COMES",
      text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "f6ca44af428306a89520d97cbad882e26df17aae",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Power-Hungry Vizier",
  id: "1w6",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Jafar",
  set: "006",
  strength: 3,
  text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
  version: "Power-Hungry Vizier",
  willpower: 4,
};
