import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletSturdySwordsmanI18n } from "./191-piglet-sturdy-swordsman.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const pigletSturdySwordsman: CharacterCard = {
  id: "ATc",
  canonicalId: "ci_W5R",
  reprints: ["set4-191"],
  cardType: "character",
  name: "Piglet",
  version: "Sturdy Swordsman",
  inkType: ["steel"],
  franchise: "Winnie the Pooh",
  set: "004",
  cardNumber: 191,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_8ac9f95c19af4213b7c6aed341965206",
    tcgPlayer: 550721,
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
  i18n: pigletSturdySwordsmanI18n,
};
