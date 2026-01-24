import type { ActionCard } from "@tcg/lorcana-types";

export const tryEverything: ActionCard = {
  id: "2vk",
  cardType: "action",
  name: "Try Everything",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 25,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0a5e3974022258c07e0af28d56ba5709c9bb85e9",
  },
  abilities: [
    {
      id: "2vk-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
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
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
    },
  ],
};
