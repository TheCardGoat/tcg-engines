import type { CharacterCard } from "@tcg/lorcana-types";
import { tiggerOneOfAKindI18n } from "./127-tigger-one-of-a-kind.i18n";

export const tiggerOneOfAKind: CharacterCard = {
  id: "n3U",
  canonicalId: "ci_n3U",
  reprints: ["set2-127"],
  cardType: "character",
  name: "Tigger",
  version: "One of a Kind",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 127,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3aef995690e4b4995241341af5f31e3",
    tcgPlayer: 524189,
  },
  text: [
    {
      title: "ENERGETIC",
      description: "Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Tigger"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ns-1",
      name: "ENERGETIC",
      text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tiggerOneOfAKindI18n,
};
