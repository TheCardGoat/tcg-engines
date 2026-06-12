import type { ActionCard } from "@tcg/lorcana-types";
import { helpingHandI18n } from "./164-helping-hand.i18n";

export const helpingHand: ActionCard = {
  id: "178",
  canonicalId: "ci_178",
  reprints: ["set6-164"],
  cardType: "action",
  name: "Helping Hand",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  cardNumber: 164,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_82a7bdb095d2477bbad45e524ad4a7dd",
    tcgPlayer: 586975,
  },
  text: "Chosen character gains Support this turn. Draw a card. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Support",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1wv-1",
      text: "Chosen character gains Support this turn. Draw a card.",
      type: "action",
    },
  ],
  i18n: helpingHandI18n,
};
