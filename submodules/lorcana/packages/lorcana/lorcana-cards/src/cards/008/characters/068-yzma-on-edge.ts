import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaOnEdgeI18n } from "./068-yzma-on-edge.i18n";

export const yzmaOnEdge: CharacterCard = {
  id: "GYU",
  canonicalId: "ci_GYU",
  reprints: ["set8-068"],
  cardType: "character",
  name: "Yzma",
  version: "On Edge",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 68,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b19fb19a289f4cf5a223278de7b2b2e0",
    tcgPlayer: 631681,
  },
  text: [
    {
      title: "WHY DO WE EVEN HAVE THAT LEVER?",
      description:
        "When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "594-1",
      text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      name: "WHY DO WE EVEN HAVE THAT LEVER?",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          filters: [
            {
              type: "name",
              equals: "Pull the Lever!",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        effect: {
          cardName: "Wrong Lever!",
          putInto: "hand",
          reveal: true,
          shuffle: true,
          type: "search-deck",
        },
        type: "optional",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: yzmaOnEdgeI18n,
};
