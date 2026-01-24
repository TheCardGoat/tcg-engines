import type { CharacterCard } from "@tcg/lorcana-types";

export const thaddeusEKlangMetallicLeader: CharacterCard = {
  id: "195",
  cardType: "character",
  name: "Thaddeus E. Klang",
  version: "Metallic Leader",
  fullName: "Thaddeus E. Klang - Metallic Leader",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "003",
  text: "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 194,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a2af14e26b21124ff42b71b213aff52299d8770a",
  },
  abilities: [
    {
      id: "195-1",
      type: "triggered",
      name: "MY TEETH ARE SHARPER",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
