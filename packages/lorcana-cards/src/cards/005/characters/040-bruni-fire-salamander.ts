import type { CharacterCard } from "@tcg/lorcana-types";

export const bruniFireSalamander: CharacterCard = {
  abilities: [
    {
      id: "29y-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "29y-2",
      name: "PARTING GIFT",
      text: "PARTING GIFT When this character is banished, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 40,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "0834d63e44b4e904e0f5c4efdbb1d73afd4952a7",
  },
  franchise: "Frozen",
  fullName: "Bruni - Fire Salamander",
  id: "29y",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Bruni",
  set: "005",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.",
  version: "Fire Salamander",
  willpower: 2,
};
