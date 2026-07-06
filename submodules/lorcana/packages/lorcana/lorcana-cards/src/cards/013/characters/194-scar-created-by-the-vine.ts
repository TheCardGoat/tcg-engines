import type { CharacterCard } from "@tcg/lorcana-types";
import { scarCreatedByTheVineI18n } from "./194-scar-created-by-the-vine.i18n";

export const scarCreatedByTheVine: CharacterCard = {
  id: "MAE",
  canonicalId: "ci_MAE",
  slug: "lorcana-ci_MAE",
  printings: [
    {
      id: "set13-194",
      artId: "set13-194",
      setCode: "set13",
      collectorNumber: "194",
      rarity: "legendary",
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
  cardNumber: 194,
  rarity: "legendary",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Victor's Reward",
      description:
        "During your turn, whenever one of your Floodborn characters banishes another character in a challenge, gain 1 lore.",
    },
    {
      title: "Fill the Ranks",
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
  i18n: scarCreatedByTheVineI18n,
};
