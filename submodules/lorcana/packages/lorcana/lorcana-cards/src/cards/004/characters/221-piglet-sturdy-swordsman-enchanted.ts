import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletSturdySwordsmanEnchantedI18n } from "./221-piglet-sturdy-swordsman-enchanted.i18n";

import { resist } from "../../../helpers/abilities/resist";

export const pigletSturdySwordsmanEnchanted: CharacterCard = {
  id: "Yuk",
  canonicalId: "ci_W5R",
  slug: "lorcana-ci_W5R",
  printings: [
    {
      id: "set4-221-enchanted",
      artId: "ci_W5R-enchanted",
      setCode: "set4",
      collectorNumber: "221",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-191"],
  cardType: "character",
  name: "Piglet",
  version: "Sturdy Swordsman",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "004",
  cardNumber: 221,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_8ac9f95c19af4213b7c6aed341965206",
    tcgPlayer: "550721",
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "NOT SO SMALL ANYMORE",
      description:
        "While you have no cards in your hand, this character can challenge ready characters.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    resist(1),
    {
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "1bb-2",
      name: "NOT SO SMALL ANYMORE",
      text: "NOT SO SMALL ANYMORE While you have no cards in your hand, this character can challenge ready characters.",
      type: "static",
    },
  ],
  i18n: pigletSturdySwordsmanEnchantedI18n,
};
