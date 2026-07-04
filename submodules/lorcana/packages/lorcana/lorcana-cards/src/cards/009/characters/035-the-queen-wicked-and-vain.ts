import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenWickedAndVainI18n } from "./035-the-queen-wicked-and-vain.i18n";

export const theQueenWickedAndVain: CharacterCard = {
  id: "Kdh",
  canonicalId: "ci_yYu",
  slug: "lorcana-ci_yYu",
  printings: [
    {
      id: "set9-035",
      artId: "set9-035",
      setCode: "set9",
      collectorNumber: "35",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-056", "set9-035"],
  cardType: "character",
  name: "The Queen",
  version: "Wicked and Vain",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 35,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ab6a9775bfbb446bb03724f1f7ba0f3a",
    tcgPlayer: "649982",
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
