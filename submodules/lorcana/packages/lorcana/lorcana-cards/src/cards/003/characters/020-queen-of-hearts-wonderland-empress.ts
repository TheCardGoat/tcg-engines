import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsWonderlandEmpressI18n } from "./020-queen-of-hearts-wonderland-empress.i18n";

export const queenOfHeartsWonderlandEmpress: CharacterCard = {
  id: "VAS",
  canonicalId: "ci_0HZ",
  reprints: ["set3-020", "set9-023"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Wonderland Empress",
  inkType: ["amber"],
  franchise: "Alice in Wonderland",
  set: "003",
  cardNumber: 20,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8da184a94db34eee8c9b4cc378a58d11",
    tcgPlayer: 649971,
  },
  text: [
    {
      title: "ALL WAYS HERE ARE MY WAYS",
      description:
        "Whenever this character quests, your other Villain characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [{ type: "has-classification", classification: "Villain" }],
        },
        type: "modify-stat",
      },
      id: "1gh-1",
      name: "ALL WAYS HERE ARE MY WAYS",
      text: "ALL WAYS HERE ARE MY WAYS Whenever this character quests, your other Villain characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: queenOfHeartsWonderlandEmpressI18n,
};
