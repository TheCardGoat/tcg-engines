import type { ActionCard } from "@tcg/lorcana-types";
import { intenseResearchI18n } from "./164-intense-research.i18n";

export const intenseResearch: ActionCard = {
  id: "7qV",
  canonicalId: "ci_7qV",
  slug: "lorcana-ci_7qV",
  printings: [
    {
      id: "set14-164",
      artId: "set14-164",
      setCode: "set14",
      collectorNumber: "164",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-164"],
  cardType: "action",
  name: "Intense Research",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 164,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cfa5c6e27d8f4465a2446e77373c162d",
  },
  text: "Look at the top 2 cards of your deck, then put one into your hand and the rest on the bottom of your deck in any order. If you removed an ink drop to play this action, look at the top 5 cards of your deck instead.",
  abilities: [
    {
      type: "action",
      text: "Look at the top 2 cards of your deck, then put one into your hand and the rest on the bottom of your deck in any order. If you removed an ink drop to play this action, look at the top 5 cards of your deck instead.",
      effect: {
        type: "conditional",
        condition: {
          type: "play-context",
          context: "paid-with-ink-drop",
        },
        then: {
          type: "scry",
          amount: 5,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "hand",
              min: 1,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
              ordering: "player-choice",
            },
          ],
        },
        else: {
          type: "scry",
          amount: 2,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "hand",
              min: 1,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
              ordering: "player-choice",
            },
          ],
        },
      },
    },
  ],
  i18n: intenseResearchI18n,
};
