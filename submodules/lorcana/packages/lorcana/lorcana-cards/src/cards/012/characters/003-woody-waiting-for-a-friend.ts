import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyWaitingForAFriendI18n } from "./003-woody-waiting-for-a-friend.i18n";

export const woodyWaitingForAFriend: CharacterCard = {
  id: "RHn",
  canonicalId: "ci_Zfj",
  slug: "lorcana-ci_Zfj",
  printings: [
    {
      id: "set12-003",
      artId: "set12-003",
      setCode: "set12",
      collectorNumber: "3",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-003"],
  cardType: "character",
  name: "Woody",
  version: "Waiting for a Friend",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 3,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2eb1fa4c7ab0498b8d4cfcd28f56a8cf",
    tcgPlayer: "692203",
  },
  classifications: ["Storyborn", "Hero", "Toy"],
  i18n: woodyWaitingForAFriendI18n,
};
