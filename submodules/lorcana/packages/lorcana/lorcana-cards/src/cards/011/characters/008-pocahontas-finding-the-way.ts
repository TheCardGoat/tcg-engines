import type { CharacterCard } from "@tcg/lorcana-types";
import { pocahontasFindingTheWayI18n } from "./008-pocahontas-finding-the-way.i18n";

export const pocahontasFindingTheWay: CharacterCard = {
  id: "3Q8",
  canonicalId: "ci_3Q8",
  reprints: ["set11-008"],
  cardType: "character",
  name: "Pocahontas",
  version: "Finding the Way",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 8,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa9b3ea05aa64ee9aa09783eb6ca425c",
    tcgPlayer: 674822,
  },
  text: [
    {
      title: "DISCOVERY AWAITS",
      description: "When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "hen-1",
      effect: {
        modifier: 1,
        stat: "lore",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
        duration: "this-turn",
      },
      name: "DISCOVERY AWAITS",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "DISCOVERY AWAITS When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  i18n: pocahontasFindingTheWayI18n,
};
