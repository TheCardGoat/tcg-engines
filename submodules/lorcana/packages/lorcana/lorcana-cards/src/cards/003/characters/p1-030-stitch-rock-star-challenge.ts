import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchRockStarP1ChallengeI18n } from "./p1-030-stitch-rock-star-challenge.i18n";

export const stitchRockStarP1Challenge: CharacterCard = {
  id: "WIt",
  canonicalId: "ci_x45",
  slug: "lorcana-ci_x45",
  printings: [
    {
      id: "set3-p1-030-challenge",
      artId: "ci_x45-challenge",
      setCode: "set3",
      collectorNumber: "30",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set1-023", "set9-003"],
  cardType: "character",
  name: "Stitch",
  version: "Rock Star",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "003",
  cardNumber: 30,
  rarity: "special",
  specialRarity: "challenge",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_65191d1c43f443469868bfc69f3aa1c4",
    tcgPlayer: "668575",
  },
  text: [
    {
      title: "<Shift> 4",
    },
    {
      title: "Adoring Fans",
      description:
        "Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Alien"],
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "y9k-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          effects: [
            {
              type: "exert",
              target: {
                ref: "trigger-subject",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              ifTrue: {
                amount: 1,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          ],
        },
        type: "optional",
      },
      id: "y9k-2",
      name: "ADORING FANS",
      text: "ADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          filters: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: stitchRockStarP1ChallengeI18n,
};
