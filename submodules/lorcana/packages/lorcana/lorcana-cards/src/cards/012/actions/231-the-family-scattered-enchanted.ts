import type { ActionCard } from "@tcg/lorcana-types";
import { theFamilyScatteredEnchantedI18n } from "./231-the-family-scattered-enchanted.i18n";

export const theFamilyScatteredEnchanted: ActionCard = {
  id: "96D",
  canonicalId: "ci_idk",
  slug: "lorcana-ci_idk",
  printings: [
    {
      id: "set12-231-enchanted",
      artId: "ci_idk-enchanted",
      setCode: "set12",
      collectorNumber: "231",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-097"],
  cardType: "action",
  name: "The Family Scattered",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 231,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  inkable: false,
  externalIds: {
    lorcast: "crd_c4e66047e01c49f4bedb6c185d0af90a",
    tcgPlayer: "692222",
  },
  text: "Chosen opponent chooses 3 of their characters and returns one of those cards to their hand, puts one on the bottom of their deck, and puts one on the top of their deck.",
  abilities: [
    {
      type: "action",
      text: "Chosen opponent chooses 3 of their characters and returns one of those cards to their hand, puts one on the bottom of their deck, and puts one on the top of their deck.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "put-on-bottom",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "put-on-top",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: theFamilyScatteredEnchantedI18n,
};
