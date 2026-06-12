import type { CharacterCard } from "@tcg/lorcana-types";
import { stegmuttClumsyDinosaurI18n } from "./079-stegmutt-clumsy-dinosaur.i18n";

export const stegmuttClumsyDinosaur: CharacterCard = {
  id: "28g",
  canonicalId: "ci_28g",
  reprints: ["set11-079"],
  cardType: "character",
  name: "Stegmutt",
  version: "Clumsy Dinosaur",
  inkType: ["emerald"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 79,
  rarity: "rare",
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5864156730e6408181fd43e5a59dbe05",
    tcgPlayer: 675390,
  },
  text: [
    {
      title: "WAKE OF DESTRUCTION",
      description: "For each item card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      title: "COLLATERAL DAMAGE",
      description:
        "When you play this character, you may put 3 item cards from your discard on the bottom of your deck in any order. If you do, deal 3 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dinosaur"],
  abilities: [
    {
      id: "10u-1",
      name: "WAKE OF DESTRUCTION",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          cardType: "item",
          owner: "you",
          zones: ["discard"],
          filters: [],
        },
      },
      text: "WAKE OF DESTRUCTION For each item card in your discard, you pay 1 {I} less to play this character.",
    },
    {
      id: "10u-2",
      name: "COLLATERAL DAMAGE",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "put-on-bottom",
              target: {
                cardTypes: ["item"],
                count: 3,
                owner: "you",
                selector: "chosen",
                zones: ["discard"],
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "deal-damage",
              amount: 3,
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
            },
          },
        ],
      },
      text: "COLLATERAL DAMAGE When you play this character, you may put 3 item cards from your discard on the bottom of your deck in any order. If you do, deal 3 damage to chosen character.",
    },
  ],
  i18n: stegmuttClumsyDinosaurI18n,
};
