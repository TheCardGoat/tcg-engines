import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaKnightInTrainingI18n } from "./176-cinderella-knight-in-training.i18n";

export const cinderellaKnightInTraining: CharacterCard = {
  id: "FdD",
  canonicalId: "ci_FdD",
  reprints: ["set2-176"],
  cardType: "character",
  name: "Cinderella",
  version: "Knight in Training",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 176,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_be028c8d6e9144f4ac4f03b17462db1c",
    tcgPlayer: 521726,
  },
  text: [
    {
      title: "HAVE COURAGE",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
      id: "8ex-1",
      name: "HAVE COURAGE",
      text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cinderellaKnightInTrainingI18n,
};
