import type { ActionCard } from "@tcg/lorcana-types";
import { ohanaMeansFamilyEnchantedI18n } from "./224-ohana-means-family-enchanted.i18n";

export const ohanaMeansFamilyEnchanted: ActionCard = {
  id: "3uR",
  canonicalId: "ci_iVN",
  slug: "lorcana-ci_iVN",
  printings: [
    {
      id: "set11-224-enchanted",
      artId: "ci_iVN-enchanted",
      setCode: "set11",
      collectorNumber: "224",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-032"],
  cardType: "action",
  name: "Ohana Means Family",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 224,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_87abaabc59344ef1bfed548f0b6753bf",
    tcgPlayer: "673068",
  },
  text: "Remove all damage from chosen character of yours. Draw a card for each 1 damage removed this way.",
  abilities: [
    {
      type: "action",
      text: "Remove all damage from chosen character of yours. Draw a card for each 1 damage removed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: 99,
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: {
              type: "for-each",
              counter: {
                type: "damage-removed",
              },
            },
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: ohanaMeansFamilyEnchantedI18n,
};
