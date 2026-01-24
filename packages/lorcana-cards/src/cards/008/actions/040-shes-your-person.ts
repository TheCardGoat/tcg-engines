import type { ActionCard } from "@tcg/lorcana-types";

export const shesYourPerson: ActionCard = {
  id: "1wu",
  cardType: "action",
  name: "She's Your Person",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  text: "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.",
  cost: 1,
  cardNumber: 40,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f7b76b092a681f79d6d10d8950f1d4f9456e82b4",
  },
  abilities: [
    {
      id: "1wu-2",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "- Remove up to 3 damage from chosen character.",
    },
    {
      id: "1wu-3",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "- Remove up to 3 damage from each of your characters with Bodyguard.",
    },
  ],
};
