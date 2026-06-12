import type { CharacterCard } from "@tcg/lorcana-types";
import { noiOrphanedThiefI18n } from "./155-noi-orphaned-thief.i18n";

export const noiOrphanedThief: CharacterCard = {
  id: "blI",
  canonicalId: "ci_blI",
  reprints: ["set2-155"],
  cardType: "character",
  name: "Noi",
  version: "Orphaned Thief",
  inkType: ["sapphire"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 155,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1e4c0158e3ac4e989d2886cf87564dd5",
    tcgPlayer: 527766,
  },
  text: [
    {
      title: "HIDE AND SEEK",
      description:
        "While you have an item in play, this character gains Resist +1 and Ward. (Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 1,
        type: "has-item-count",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "r47-1",
      name: "HIDE AND SEEK",
      text: "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward.",
      type: "static",
    },
    {
      condition: {
        comparison: "greater-or-equal",
        controller: "you",
        count: 1,
        type: "has-item-count",
      },
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "r47-2",
      name: "HIDE AND SEEK",
      text: "HIDE AND SEEK While you have an item in play, this character gains Resist +1 and Ward.",
      type: "static",
    },
  ],
  i18n: noiOrphanedThiefI18n,
};
