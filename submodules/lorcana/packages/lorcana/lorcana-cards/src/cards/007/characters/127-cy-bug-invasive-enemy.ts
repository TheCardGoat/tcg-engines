import type { CharacterCard } from "@tcg/lorcana-types";
import { cybugInvasiveEnemyI18n } from "./127-cy-bug-invasive-enemy.i18n";

export const cybugInvasiveEnemy: CharacterCard = {
  id: "084",
  canonicalId: "ci_084",
  reprints: ["set7-127"],
  cardType: "character",
  name: "Cy-Bug",
  version: "Invasive Enemy",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 127,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b9cf5f433cd840c295d3b74c39583ee1",
    tcgPlayer: 619475,
  },
  text: [
    {
      title: "HIVE MIND",
      description: "This character gets +1 {S} for each other character you have in play.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [],
          excludeSelf: true,
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ls-1",
      name: "HIVE MIND",
      text: "HIVE MIND This character gets +1 {S} for each other character you have in play.",
      type: "static",
    },
  ],
  i18n: cybugInvasiveEnemyI18n,
};
