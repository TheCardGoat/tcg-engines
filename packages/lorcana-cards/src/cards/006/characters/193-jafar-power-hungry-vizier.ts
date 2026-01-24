import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarPowerhungryVizier: CharacterCard = {
  id: "1w6",
  cardType: "character",
  name: "Jafar",
  version: "Power-Hungry Vizier",
  fullName: "Jafar - Power-Hungry Vizier",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "006",
  text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 193,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f6ca44af428306a89520d97cbad882e26df17aae",
  },
  abilities: [
    {
      id: "1w6-1",
      type: "triggered",
      name: "YOU WILL BE PAID WHEN THE TIME COMES",
      trigger: { event: "play", timing: "when", on: "SELF" },
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
      text: "YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
