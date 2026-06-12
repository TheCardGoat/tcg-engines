import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaRulerOfPrideRockI18n } from "./150-mufasa-ruler-of-pride-rock.i18n";

export const mufasaRulerOfPrideRock: CharacterCard = {
  id: "6p3",
  canonicalId: "ci_Q4A",
  reprints: ["set5-150"],
  cardType: "character",
  name: "Mufasa",
  version: "Ruler of Pride Rock",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 150,
  rarity: "legendary",
  cost: 8,
  strength: 4,
  willpower: 9,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_ca78ff510359490a862b871b577a5fec",
    tcgPlayer: 562021,
  },
  text: [
    {
      title: "A DELICATE BALANCE",
      description:
        "When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
    },
    {
      title: "EVERYTHING THE LIGHT TOUCHES",
      description: "Whenever this character quests, ready all cards in your inkwell.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["inkwell"],
            },
            type: "exert",
          },
          {
            type: "return-random-from-inkwell",
            count: 2,
          },
        ],
        type: "sequence",
      },
      id: "163-1",
      name: "A DELICATE BALANCE",
      text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: {
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["inkwell"],
        },
        type: "ready",
      },
      id: "163-2",
      name: "EVERYTHING THE LIGHT TOUCHES",
      text: "EVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mufasaRulerOfPrideRockI18n,
};
