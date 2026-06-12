import type { CharacterCard } from "@tcg/lorcana-types";
import { handintheboxSidsToyI18n } from "./114-hand-in-the-box-sids-toy.i18n";

export const handintheboxSidsToy: CharacterCard = {
  id: "LbY",
  canonicalId: "ci_LbY",
  reprints: ["set12-114"],
  cardType: "character",
  name: "Hand-in-the-Box",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 114,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_309b96e0cc0f4a40a3a7b381b2823e0d",
  },
  text: [
    {
      title: "SPRING-LOADED",
      description:
        "You may put a Toy character card from your discard on the bottom of your deck to play this character for free.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
            filters: [
              {
                type: "has-classification",
                classification: "Toy",
              },
            ],
          },
          type: "put-on-bottom",
        },
        type: "optional",
      },
      alternativeCost: "put-toy-character-on-deck-bottom",
      id: "LbY-1",
      name: "SPRING-LOADED",
      text: "SPRING-LOADED You may put a Toy character card from your discard on the bottom of your deck to play this character for free.",
      type: "action",
    },
  ],
  i18n: handintheboxSidsToyI18n,
};
