import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaFutureKingI18n } from "./188-simba-future-king.i18n";

export const simbaFutureKing: CharacterCard = {
  id: "dTm",
  canonicalId: "ci_dTm",
  reprints: ["set1-188"],
  cardType: "character",
  name: "Simba",
  version: "Future King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 188,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9f35462bf6cc430f89c193d85507ea73",
    tcgPlayer: 502536,
  },
  text: [
    {
      title: "GUESS WHAT?",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
      id: "q21-1",
      name: "GUESS WHAT?",
      text: "GUESS WHAT? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: simbaFutureKingI18n,
};
