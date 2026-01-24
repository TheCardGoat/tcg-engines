import type { CharacterCard } from "@tcg/lorcana-types";

export const geppettoSkilledCraftsman: CharacterCard = {
  id: "1ae",
  cardType: "character",
  name: "Geppetto",
  version: "Skilled Craftsman",
  fullName: "Geppetto - Skilled Craftsman",
  inkType: ["sapphire"],
  franchise: "Pinocchio",
  set: "008",
  text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 174,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a73496316fa073149d81e6831fb59c5170aa9689",
  },
  abilities: [
    {
      id: "1ae-1",
      type: "triggered",
      name: "SEEKING INSPIRATION",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
};
