import type { CharacterCard } from "@tcg/lorcana-types";
import { russellFindingAdventureI18n } from "./020-russell-finding-adventure.i18n";

export const russellFindingAdventure: CharacterCard = {
  id: "V8L",
  canonicalId: "ci_V8L",
  slug: "lorcana-ci_V8L",
  printings: [
    {
      id: "set14-020",
      artId: "set14-020",
      setCode: "set14",
      collectorNumber: "20",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-020"],
  cardType: "character",
  name: "Russell",
  version: "Finding Adventure",
  inkType: ["amber"],
  franchise: "Up",
  set: "014",
  cardNumber: 20,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Hide and Seek",
      description:
        "{E} — Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "V8L-1",
      name: "Hide and Seek",
      type: "activated",
      cost: { exert: true },
      text: "Hide and Seek {E} — Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
      effect: {
        type: "scry",
        amount: 2,
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            remainder: true,
            min: 0,
            max: 2,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: russellFindingAdventureI18n,
};
