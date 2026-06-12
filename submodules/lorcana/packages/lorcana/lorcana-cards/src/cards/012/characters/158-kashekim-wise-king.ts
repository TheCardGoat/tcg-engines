import type { CharacterCard } from "@tcg/lorcana-types";
import { kashekimWiseKingI18n } from "./158-kashekim-wise-king.i18n";

export const kashekimWiseKing: CharacterCard = {
  id: "9CP",
  canonicalId: "ci_9CP",
  reprints: ["set12-158"],
  cardType: "character",
  name: "Kashekim",
  version: "Wise King",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 158,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8950c4a97e2f4ccc8c5008b82356aec4",
  },
  text: [
    {
      title: "STRENGTH IN MEMORY",
      description:
        "At the end of your turn, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      id: "9CP-1",
      name: "STRENGTH IN MEMORY",
      type: "triggered",
      text: "STRENGTH IN MEMORY At the end of your turn, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown.",
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
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          facedown: true,
        },
      },
    },
  ],
  i18n: kashekimWiseKingI18n,
};
