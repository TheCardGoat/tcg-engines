import type { CharacterCard } from "@tcg/lorcana-types";
import { chipRetrievalExpertI18n } from "./014-chip-retrieval-expert.i18n";

export const chipRetrievalExpert: CharacterCard = {
  id: "Eav",
  canonicalId: "ci_Eav",
  reprints: ["set12-014"],
  cardType: "character",
  name: "Chip",
  version: "Retrieval Expert",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 14,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_af3e6cbd8d7b41be9f4e9a476358ab6a",
  },
  text: [
    {
      title: "THERE YOU ARE!",
      description:
        "When you play this character, you may return a character card with 4 {W} or more from your discard to your hand.",
    },
    {
      title: "FRIENDLY ASSIST",
      description: "Your characters named Dale get +1 {W}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "Eav-1",
      name: "THERE YOU ARE!",
      type: "triggered",
      text: "THERE YOU ARE! When you play this character, you may return a character card with 4 {W} or more from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "character",
          target: "CONTROLLER",
          filter: {
            type: "willpower-comparison",
            comparison: "greater-or-equal",
            value: 4,
          },
        },
      },
    },
    {
      id: "Eav-2",
      name: "FRIENDLY ASSIST",
      type: "static",
      text: "FRIENDLY ASSIST Your characters named Dale get +1 {W}.",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Dale",
            },
          ],
        },
      },
    },
  ],
  i18n: chipRetrievalExpertI18n,
};
