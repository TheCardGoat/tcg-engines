import type { ItemCard } from "@tcg/lorcana-types";
import { captainHooksRapierI18n } from "./199-captain-hooks-rapier.i18n";

export const captainHooksRapier: ItemCard = {
  id: "tET",
  canonicalId: "ci_tET",
  reprints: ["set3-199"],
  cardType: "item",
  name: "Captain Hook's Rapier",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 199,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_3c6f007d30714e5183dc6d9da8b200ae",
    tcgPlayer: 537759,
  },
  text: [
    {
      title: "GET THOSE SCURVY BRATS!",
      description:
        "During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
    },
    {
      title: "LET'S HAVE AT IT!",
      description:
        "Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "optional",
      },
      id: "1wl-1",
      name: "GET THOSE SCURVY BRATS!",
      text: "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
      trigger: {
        challengeContext: { role: "attacker" },
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Challenger",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Captain Hook",
            },
          ],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "1wl-2",
      name: "LET'S HAVE AT IT!",
      text: "LET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1.",
      type: "static",
    },
  ],
  i18n: captainHooksRapierI18n,
};
