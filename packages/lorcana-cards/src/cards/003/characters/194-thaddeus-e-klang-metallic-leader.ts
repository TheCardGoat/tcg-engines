import type { CharacterCard } from "@tcg/lorcana-types";

export const thaddeusEKlangMetallicLeader: CharacterCard = {
  abilities: [
    {
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
      id: "195-1",
      name: "MY TEETH ARE SHARPER",
      text: "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "a2af14e26b21124ff42b71b213aff52299d8770a",
  },
  franchise: "Talespin",
  fullName: "Thaddeus E. Klang - Metallic Leader",
  id: "195",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Thaddeus E. Klang",
  set: "003",
  strength: 3,
  text: "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
  version: "Metallic Leader",
  willpower: 5,
};
