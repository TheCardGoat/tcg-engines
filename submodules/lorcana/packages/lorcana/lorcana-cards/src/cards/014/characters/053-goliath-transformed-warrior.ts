import type { CharacterCard } from "@tcg/lorcana-types";
import { goliathTransformedWarriorI18n } from "./053-goliath-transformed-warrior.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const goliathTransformedWarrior: CharacterCard = {
  id: "vb5",
  canonicalId: "ci_vb5",
  slug: "lorcana-ci_vb5",
  printings: [
    {
      id: "set14-053",
      artId: "set14-053",
      setCode: "set14",
      collectorNumber: "53",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-053"],
  cardType: "character",
  name: "Goliath",
  version: "Transformed Warrior",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "014",
  cardNumber: 53,
  rarity: "rare",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_88d01d81e9344671b6534f6f964a68d6",
  },
  text: [
    {
      title: "WHEN NIGHT FALLS",
      description:
        "Once during your turn, you may choose and discard a card. If you do, move up to 2 damage from this character to chosen opposing character.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Gargoyle"],
  abilities: [
    {
      id: "vb5-1",
      name: "WHEN NIGHT FALLS",
      type: "activated",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      restrictions: [
        {
          type: "once-per-turn",
        },
      ],
      effect: {
        type: "move-damage",
        amount: {
          type: "up-to",
          value: 2,
        },
        from: "SELF",
        to: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
      },
      text: "WHEN NIGHT FALLS Once during your turn, you may choose and discard a card. If you do, move up to 2 damage from this character to chosen opposing character.",
    },
    stoneByDay,
  ],
  i18n: goliathTransformedWarriorI18n,
};
