import type { CharacterCard } from "@tcg/lorcana-types";
import { flotsamUrsulasBabyI18n } from "./043-flotsam-ursulas-baby.i18n";

export const flotsamUrsulasBaby: CharacterCard = {
  id: "8TS",
  canonicalId: "ci_8TS",
  reprints: ["set4-043"],
  cardType: "character",
  name: "Flotsam",
  version: 'Ursula\'s "Baby"',
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 43,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5fb77165fcbc43e99fc15c3d64426b65",
    tcgPlayer: 549467,
  },
  text: [
    {
      title: "QUICK ESCAPE",
      description: "When this character is banished in a challenge, return this card to your hand.",
    },
    {
      title: "OMINOUS PAIR",
      description:
        'Your characters named Jetsam gain "When this character is banished in a challenge, return this card to your hand."',
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "1e2-1",
      name: "QUICK ESCAPE",
      text: "QUICK ESCAPE When this character is banished in a challenge, return this card to your hand.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
    },
    {
      id: "1e2-2",
      name: "OMINOUS PAIR",
      text: 'OMINOUS PAIR Your characters named Jetsam gain "When this character is banished in a challenge, return this card to your hand."',
      type: "triggered",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          name: "Jetsam",
          excludeSelf: true,
        },
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      effect: {
        target: {
          ref: "trigger-subject",
        },
        type: "return-to-hand",
      },
    },
  ],
  i18n: flotsamUrsulasBabyI18n,
};
