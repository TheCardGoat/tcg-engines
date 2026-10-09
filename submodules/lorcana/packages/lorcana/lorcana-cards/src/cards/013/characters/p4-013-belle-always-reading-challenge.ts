import type { CharacterCard } from "@tcg/lorcana-types";
import { belleAlwaysReadingP4ChallengeI18n } from "./p4-013-belle-always-reading-challenge.i18n";

export const belleAlwaysReadingP4Challenge: CharacterCard = {
  id: "U0y",
  canonicalId: "ci_WGT",
  slug: "lorcana-ci_WGT",
  printings: [
    {
      id: "set13-p4-013-challenge",
      artId: "ci_WGT-challenge",
      setCode: "set13",
      collectorNumber: "13",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set13-148"],
  cardType: "character",
  name: "Belle",
  version: "Always Reading",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 13,
  rarity: "special",
  specialRarity: "challenge",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f0fc8f569f84d628af731a571bc62b1",
    tcgPlayer: "702694",
  },
  text: [
    {
      title: "DREAMING OF MORE",
      description: "You pay 1 {I} less to shift a character on top of this character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "WGT-1",
      name: "DREAMING OF MORE",
      type: "static",
      text: "DREAMING OF MORE You pay 1 {I} less to shift a character on top of this character.",
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "shift",
        target: "SELF",
      },
    },
  ],
  i18n: belleAlwaysReadingP4ChallengeI18n,
};
