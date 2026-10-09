import type { CharacterCard } from "@tcg/lorcana-types";
import { rebeccaCunninghamSavvyManagerI18n } from "./080-rebecca-cunningham-savvy-manager.i18n";

export const rebeccaCunninghamSavvyManager: CharacterCard = {
  id: "d5C",
  canonicalId: "ci_d5C",
  slug: "lorcana-ci_d5C",
  printings: [
    {
      id: "set14-080",
      artId: "set14-080",
      setCode: "set14",
      collectorNumber: "80",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-080"],
  cardType: "character",
  name: "Rebecca Cunningham",
  version: "Savvy Manager",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 80,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b6e7bc1b18f44549a0d0b7fd122284c0",
  },
  text: [
    {
      title: "DUE DILIGENCE",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "d5C-1",
      name: "DUE DILIGENCE",
      type: "triggered",
      text: "DUE DILIGENCE When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: rebeccaCunninghamSavvyManagerI18n,
};
