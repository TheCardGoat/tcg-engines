import type { ActionCard } from "@tcg/lorcana-types";

export const shesYourPerson: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1wu-2",
      text: "- Remove up to 3 damage from chosen character.",
      type: "action",
    },
    {
      effect: {
        amount: 3,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1wu-3",
      text: "- Remove up to 3 damage from each of your characters with Bodyguard.",
      type: "action",
    },
  ],
  cardNumber: 40,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "f7b76b092a681f79d6d10d8950f1d4f9456e82b4",
  },
  franchise: "Bolt",
  id: "1wu",
  inkType: ["amber", "steel"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "She's Your Person",
  set: "008",
  text: "Choose one:\n- Remove up to 3 damage from chosen character.\n- Remove up to 3 damage from each of your characters with Bodyguard.",
};
