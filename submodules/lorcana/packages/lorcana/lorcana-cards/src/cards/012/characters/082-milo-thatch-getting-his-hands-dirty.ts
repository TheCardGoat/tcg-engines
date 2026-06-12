import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchGettingHisHandsDirtyI18n } from "./082-milo-thatch-getting-his-hands-dirty.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const miloThatchGettingHisHandsDirty: CharacterCard = {
  id: "d9j",
  canonicalId: "ci_d9j",
  reprints: ["set12-082"],
  cardType: "character",
  name: "Milo Thatch",
  version: "Getting His Hands Dirty",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 82,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_9e585ec03c314f3b9a6299163eb1c9a9",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "SCHOLAR'S GAMBIT",
      description:
        "When you play this character, you may choose and discard a card to return chosen character to their player's hand.",
    },
    {
      title: "PRACTICAL KNOWLEDGE",
      description:
        "At the end of your turn, if 2 or more cards were put into your discard this turn, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    ward,
    {
      id: "d9j-2",
      name: "SCHOLAR'S GAMBIT",
      type: "triggered",
      text: "SCHOLAR'S GAMBIT When you play this character, you may choose and discard a card to return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
            },
            {
              type: "return-to-hand",
              target: "CHOSEN_CHARACTER",
            },
          ],
        },
      },
    },
    {
      id: "d9j-3",
      name: "PRACTICAL KNOWLEDGE",
      type: "triggered",
      text: "PRACTICAL KNOWLEDGE At the end of your turn, if 2 or more cards were put into your discard this turn, draw a card.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: miloThatchGettingHisHandsDirtyI18n,
};
