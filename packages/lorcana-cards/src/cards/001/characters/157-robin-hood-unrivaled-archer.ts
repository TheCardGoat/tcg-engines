import type { CharacterCard } from "@tcg/lorcana-types";

export const RobinHoodUnrivaledArcher: CharacterCard = {
  id: "dq9",
  cardType: "character",
  name: "Robin Hood",
  version: "Unrivaled Archer",
  fullName: "Robin Hood - Unrivaled Archer",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
      id: "dq9-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their hand than you",
        },
        then: {
          type: "draw",
          text: "**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)",
          id: "dq9-2",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Hero", "Storyborn"],
};
