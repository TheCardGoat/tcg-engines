import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSurferI18n } from "./021-stitch-carefree-surfer.i18n";

export const stitchCarefreeSurfer: CharacterCard = {
  id: "bms",
  canonicalId: "ci_44h",
  reprints: ["set1-021", "set9-024"],
  cardType: "character",
  name: "Stitch",
  version: "Carefree Surfer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 21,
  rarity: "legendary",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fdaea5bd7f31497a8284771dd57894cf",
    tcgPlayer: 649972,
  },
  text: [
    {
      title: "OHANA",
      description:
        "When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
  abilities: [
    {
      id: "bms-1",
      name: "OHANA",
      text: "OHANA When you play this character, if you have 2 or more other characters in play, you may draw 2 cards.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
      },
    },
  ],
  i18n: stitchCarefreeSurferI18n,
};
