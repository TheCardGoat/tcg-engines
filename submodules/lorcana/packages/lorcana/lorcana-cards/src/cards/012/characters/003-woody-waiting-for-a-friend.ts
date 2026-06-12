import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyWaitingForAFriendI18n } from "./003-woody-waiting-for-a-friend.i18n";

export const woodyWaitingForAFriend: CharacterCard = {
  id: "Zfj",
  canonicalId: "ci_Zfj",
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
    lorcast: "crd_ff8566269f8e44b2ae13abb3a79a27dd",
  },
  classifications: ["Storyborn", "Hero", "Toy"],
  i18n: woodyWaitingForAFriendI18n,
};
