import type { ActionCard } from "@tcg/lorcana-types";
import { theReturnOfHerculesEnchantedI18n } from "./215-the-return-of-hercules-enchanted.i18n";

export const theReturnOfHerculesEnchanted: ActionCard = {
  id: "9Gk",
  canonicalId: "ci_B2d",
  slug: "lorcana-ci_B2d",
  printings: [
    {
      id: "set7-215-enchanted",
      artId: "ci_B2d-enchanted",
      setCode: "set7",
      collectorNumber: "215",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-118"],
  cardType: "action",
  name: "The Return of Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "007",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_7896cd21215c42609fc262c908068d94",
    tcgPlayer: "619743",
  },
  text: "Each player may reveal a character card from their hand and play it for free.",
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              cardType: "character",
              cost: "free",
              filter: {
                cardType: "character",
              },
              from: "hand",
              target: "CONTROLLER",
              type: "play-card",
            },
            type: "optional",
          },
          {
            chooser: "OPPONENT",
            effect: {
              cardType: "character",
              cost: "free",
              filter: {
                cardType: "character",
              },
              from: "hand",
              target: "OPPONENT",
              type: "play-card",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "nej-1",
      text: "Each player may reveal a character card from their hand and play it for free.",
      type: "action",
    },
  ],
  i18n: theReturnOfHerculesEnchantedI18n,
};
