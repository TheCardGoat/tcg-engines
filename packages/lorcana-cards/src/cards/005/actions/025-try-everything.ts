import type { ActionCard } from "@tcg/lorcana-types";

export const tryEverything: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            steps: [
              {
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
              {
                type: "ready",
                target: "CHOSEN_CHARACTER",
              },
            ],
            type: "sequence",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "2vk-1",
      text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 25,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "0a5e3974022258c07e0af28d56ba5709c9bb85e9",
  },
  franchise: "Zootropolis",
  id: "2vk",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Try Everything",
  set: "005",
  text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
};
