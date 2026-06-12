import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceGrowingGirlI18n } from "./137-alice-growing-girl.i18n";

export const aliceGrowingGirl: CharacterCard = {
  id: "6Vx",
  canonicalId: "ci_Gej",
  reprints: ["set2-137", "set9-160"],
  cardType: "character",
  name: "Alice",
  version: "Growing Girl",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 137,
  rarity: "legendary",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8619541a52554ab3b8a32dcaf795748e",
    tcgPlayer: 647672,
  },
  text: [
    {
      title: "GOOD ADVICE",
      description:
        "Your other characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
    {
      title: "WHAT DID I DO?",
      description: "While this character has 10 {S} or more, she gets +4 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        keyword: "Support",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "gain-keyword",
      },
      id: "1ao-1",
      name: "GOOD ADVICE",
      text: "GOOD ADVICE Your other characters gain Support.",
      type: "static",
    },
    {
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 10,
        comparison: "greater-or-equal",
        target: "SELF",
      },
      effect: {
        modifier: 4,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ao-2",
      name: "WHAT DID I DO?",
      text: "WHAT DID I DO? While this character has 10 {S} or more, she gets +4 {L}.",
      type: "static",
    },
  ],
  i18n: aliceGrowingGirlI18n,
};
