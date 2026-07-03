import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaConnivingChemistEnchantedI18n } from "./209-yzma-conniving-chemist-enchanted.i18n";

export const yzmaConnivingChemistEnchanted: CharacterCard = {
  id: "S6u",
  canonicalId: "ci_O2Y",
  slug: "lorcana-ci_O2Y",
  printings: [
    {
      id: "set6-209-enchanted",
      artId: "ci_O2Y-enchanted",
      setCode: "set6",
      collectorNumber: "209",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-056"],
  cardType: "character",
  name: "Yzma",
  version: "Conniving Chemist",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "006",
  cardNumber: 209,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b8f5f89ae4fa49e29637b1fffd9c9e4c",
    tcgPlayer: "592013",
  },
  text: [
    {
      title: "FEEL THE POWER",
      description:
        "{E} — If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "5QH-1",
      name: "FEEL THE POWER",
      text: "FEEL THE POWER {E} - If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
      type: "activated",
      cost: {
        exert: true,
      },
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "less-than",
        value: 3,
      },
      effect: {
        type: "draw-until-hand-size",
        size: 3,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: yzmaConnivingChemistEnchantedI18n,
};
