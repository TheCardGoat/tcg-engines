import type { ActionCard } from "@tcg/lorcana-types";
import { tryEverythingI18n } from "./025-try-everything.i18n";

export const tryEverything: ActionCard = {
  id: "2yZ",
  canonicalId: "ci_2yZ",
  reprints: ["set5-025"],
  cardType: "action",
  name: "Try Everything",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  cardNumber: 25,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_43b3128f2b504d7b9364db3803511c13",
    tcgPlayer: 559171,
  },
  text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            steps: [
              {
                type: "remove-damage",
                amount: { type: "up-to", value: 3 },
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
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
          {
            duration: "this-turn",
            restriction: "cant-challenge",
            target: {
              ref: "previous-target",
            },
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
  i18n: tryEverythingI18n,
};
