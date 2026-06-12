import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverGreedyTreasureSeekerI18n } from "./176-john-silver-greedy-treasure-seeker.i18n";

export const johnSilverGreedyTreasureSeeker: CharacterCard = {
  id: "5zh",
  canonicalId: "ci_8IC",
  reprints: ["set3-176", "set9-192"],
  cardType: "character",
  name: "John Silver",
  version: "Greedy Treasure Seeker",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 176,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8db5f81d06034612b857a11fc606c5d2",
    tcgPlayer: 650125,
  },
  text: [
    {
      title: "CHART YOUR OWN COURSE",
      description:
        "For each location you have in play, this character gains Resist +1 and gets +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "filtered-count",
          filters: [],
          owner: "you",
          cardType: "location",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "jy5-1",
      name: "CHART YOUR OWN COURSE",
      text: "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}.",
      type: "static",
    },
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: {
          type: "filtered-count",
          filters: [],
          owner: "you",
          cardType: "location",
        },
      },
      id: "jy5-2",
      name: "CHART YOUR OWN COURSE",
      text: "CHART YOUR OWN COURSE For each location you have in play, this character gains Resist +1 and gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: johnSilverGreedyTreasureSeekerI18n,
};
