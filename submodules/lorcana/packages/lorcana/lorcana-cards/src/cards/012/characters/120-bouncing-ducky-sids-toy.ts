import type { CharacterCard } from "@tcg/lorcana-types";
import { bouncingDuckySidsToyI18n } from "./120-bouncing-ducky-sids-toy.i18n";

export const bouncingDuckySidsToy: CharacterCard = {
  id: "52H",
  canonicalId: "ci_52H",
  reprints: ["set12-120"],
  cardType: "character",
  name: "Bouncing Ducky",
  version: "Sid's Toy",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 120,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_53304492277b499dbe09d52c0708c9ea",
  },
  text: [
    {
      title: "REJECTED TOYS",
      description:
        "For each Toy character card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "REPURPOSED",
      description:
        "When you play this character, put all Toy character cards from your discard on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "52H-1",
      name: "REJECTED TOYS",
      type: "static",
      text: "REJECTED TOYS For each Toy character card in your discard, you pay 1 {I} less to play this character.",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        cardType: "character",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["discard"],
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Toy",
            },
          ],
        },
      },
    },
    {
      id: "52H-2",
      name: "REPURPOSED",
      type: "triggered",
      text: "REPURPOSED When you play this character, put all Toy character cards from your discard on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "put-on-bottom",
        ordering: "player-choice",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Toy",
            },
          ],
        },
      },
    },
  ],
  i18n: bouncingDuckySidsToyI18n,
};
