import type { CharacterCard } from "@tcg/lorcana-types";

export const geppettoSkilledCraftsman: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "1ae-1",
      name: "SEEKING INSPIRATION",
      text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 174,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Inventor"],
  cost: 5,
  externalIds: {
    ravensburger: "a73496316fa073149d81e6831fb59c5170aa9689",
  },
  franchise: "Pinocchio",
  fullName: "Geppetto - Skilled Craftsman",
  id: "1ae",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Geppetto",
  set: "008",
  strength: 4,
  text: "SEEKING INSPIRATION Whenever this character quests, you may choose and discard any number of item cards to gain 1 lore for each item card discarded this way.",
  version: "Skilled Craftsman",
  willpower: 4,
};
