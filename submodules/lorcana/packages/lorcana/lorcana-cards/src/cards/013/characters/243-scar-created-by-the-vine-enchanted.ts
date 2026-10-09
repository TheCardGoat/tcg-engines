import type { CharacterCard } from "@tcg/lorcana-types";
import { scarCreatedByTheVineEnchantedI18n } from "./243-scar-created-by-the-vine-enchanted.i18n";

export const scarCreatedByTheVineEnchanted: CharacterCard = {
  id: "dpD",
  canonicalId: "ci_MAE",
  slug: "lorcana-ci_MAE",
  printings: [
    {
      id: "set13-243-enchanted",
      artId: "ci_MAE-enchanted",
      setCode: "set13",
      collectorNumber: "243",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-194"],
  cardType: "character",
  name: "Scar",
  version: "Created by the Vine",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "013",
  cardNumber: 243,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_7e0e75f0935349869524de14d4b6bd22",
    tcgPlayer: "704690",
  },
  text: [
    {
      title: "VICTOR'S REWARD",
      description:
        "During your turn, whenever one of your Floodborn characters banishes another character in a challenge, gain 1 lore.",
    },
    {
      title: "FILL THE RANKS",
      description:
        "During an opponent's turn, whenever one of your Floodborn characters is banished, draw a card.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "triggered",
      name: "VICTOR'S REWARD",
      text: "VICTOR'S REWARD During your turn, whenever one of your Floodborn characters banishes another character in a challenge, gain 1 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
    {
      type: "triggered",
      name: "FILL THE RANKS",
      text: "FILL THE RANKS During an opponent's turn, whenever one of your Floodborn characters is banished, draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: scarCreatedByTheVineEnchantedI18n,
};
