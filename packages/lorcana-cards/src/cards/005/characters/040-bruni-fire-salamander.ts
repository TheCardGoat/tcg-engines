import type { CharacterCard } from "@tcg/lorcana-types";

export const bruniFireSalamander: CharacterCard = {
  id: "29y",
  cardType: "character",
  name: "Bruni",
  version: "Fire Salamander",
  fullName: "Bruni - Fire Salamander",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 40,
  inkable: true,
  externalIds: {
    ravensburger: "0834d63e44b4e904e0f5c4efdbb1d73afd4952a7",
  },
  abilities: [
    {
      id: "29y-1",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "29y-2",
      name: "PARTING GIFT",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
