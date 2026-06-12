import type { CharacterCard } from "@tcg/lorcana-types";
import { elinorRenownedDiplomatI18n } from "./086-elinor-renowned-diplomat.i18n";

export const elinorRenownedDiplomat: CharacterCard = {
  id: "9Uo",
  canonicalId: "ci_9Uo",
  reprints: ["set12-086"],
  cardType: "character",
  name: "Elinor",
  version: "Renowned Diplomat",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 86,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5d81f75d900f4ec4b6868519fc9c557e",
  },
  text: [
    {
      title: "COORDINATED EFFORTS",
      description:
        "At the end of your turn, if you have 3 or more exerted characters in play, deal 1 damage to chosen opposing character, gain 1 lore, and draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Queen"],
  abilities: [
    {
      id: "9Uo-1",
      name: "COORDINATED EFFORTS",
      type: "triggered",
      text: "COORDINATED EFFORTS At the end of your turn, if you have 3 or more exerted characters in play, deal 1 damage to chosen opposing character, gain 1 lore, and draw a card.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          zones: ["play"],
          cardType: "character",
          owner: "you",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            amount: 1,
            target: "CHOSEN_OPPOSING_CHARACTER",
          },
          {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: elinorRenownedDiplomatI18n,
};
