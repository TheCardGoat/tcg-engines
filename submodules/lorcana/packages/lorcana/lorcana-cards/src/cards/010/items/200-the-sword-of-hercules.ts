import type { ItemCard } from "@tcg/lorcana-types";
import { theSwordOfHerculesI18n } from "./200-the-sword-of-hercules.i18n";

export const theSwordOfHercules: ItemCard = {
  id: "v9r",
  canonicalId: "ci_www",
  reprints: ["set10-200"],
  cardType: "item",
  name: "The Sword of Hercules",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 200,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_70fa88bf3a35452b8178209944e8604a",
    tcgPlayer: 660031,
  },
  text: [
    {
      title: "MIGHTY HIT",
      description: "When you play this item, banish chosen opposing Deity character.",
    },
    {
      title: "HAND-TO-HAND",
      description:
        "During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "has-classification",
              classification: "Deity",
            },
          ],
        },
        type: "banish",
      },
      id: "1lh-1",
      name: "MIGHTY HIT",
      text: "MIGHTY HIT When you play this item, banish chosen opposing Deity character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1lh-2",
      name: "HAND-TO-HAND",
      text: "HAND-TO-HAND During your turn, whenever one of your characters banishes another character in a challenge, gain 1 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theSwordOfHerculesI18n,
};
