import type { ItemCard } from "@tcg/lorcana-types";
import { theThunderquackI18n } from "./202-the-thunderquack.i18n";

export const theThunderquack: ItemCard = {
  id: "JXM",
  canonicalId: "ci_JXM",
  reprints: ["set11-202"],
  cardType: "item",
  name: "The Thunderquack",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 202,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_997f90baa0e94ea6bf9babc7ded3bc8a",
    tcgPlayer: 676250,
  },
  text: [
    {
      title: "VIGILANTE JUSTICE",
      description: "All opposing characters gain the Villain classification.",
    },
    {
      title: "LAY OF THE LAND",
      description: "{E} — If a character was banished in a challenge this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "1ba-1",
      name: "VIGILANTE JUSTICE",
      type: "static",
      effect: {
        type: "property-modification",
        property: "classification",
        operation: "add",
        value: "Villain",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "VIGILANTE JUSTICE All opposing characters gain the Villain classification.",
    },
    {
      id: "1ba-2",
      name: "LAY OF THE LAND",
      type: "activated",
      cost: {
        exert: true,
      },
      condition: {
        type: "banished-in-challenge-this-turn",
        owner: "any",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "LAY OF THE LAND {E} — If a character was banished in a challenge this turn, gain 1 lore.",
    },
  ],
  i18n: theThunderquackI18n,
};
