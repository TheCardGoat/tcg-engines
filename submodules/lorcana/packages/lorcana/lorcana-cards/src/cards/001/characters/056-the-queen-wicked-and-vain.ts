import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenWickedAndVainI18n } from "./056-the-queen-wicked-and-vain.i18n";

export const theQueenWickedAndVain: CharacterCard = {
  id: "KjI",
  canonicalId: "ci_yYu",
  reprints: ["set1-056", "set9-035"],
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "001",
  cardNumber: 56,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ab6a9775bfbb446bb03724f1f7ba0f3a",
    tcgPlayer: 649982,
  },
  text: [
    {
      title: "I SUMMON THEE",
      description: "{E} — Draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [
    {
      id: "2kk-1",
      name: "I SUMMON THEE",
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "activated",
      text: "I SUMMON THEE {E} — Draw a card.",
    },
  ],
  i18n: theQueenWickedAndVainI18n,
};
