import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodUnrivaledArcherI18n } from "./157-robin-hood-unrivaled-archer.i18n";

export const robinHoodUnrivaledArcher: CharacterCard = {
  id: "0is",
  canonicalId: "ci_h2F",
  reprints: ["set1-157", "set9-162"],
  cardType: "character",
  name: "Robin Hood",
  version: "Unrivaled Archer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "001",
  cardNumber: 157,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b00a7190a315433ebbd327dd79450960",
    tcgPlayer: 650096,
  },
  text: [
    {
      title: "FEED THE POOR",
      description:
        "When you play this character, if an opponent has more cards in their hand than you, draw a card.",
    },
    {
      title: "GOOD SHOT",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "v3n-1",
      name: "FEED THE POOR",
      text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, draw a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "comparison",
        left: { type: "cards-in-hand", controller: "opponent" },
        comparison: "greater",
        right: { type: "cards-in-hand", controller: "you" },
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "v3n-2",
      name: "GOOD SHOT",
      text: "GOOD SHOT During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: robinHoodUnrivaledArcherI18n,
};
