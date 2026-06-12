import type { CharacterCard } from "@tcg/lorcana-types";
import { littleJohnLoyalFriendI18n } from "./084-little-john-loyal-friend.i18n";

export const littleJohnLoyalFriend: CharacterCard = {
  id: "A4r",
  canonicalId: "ci_A4r",
  reprints: ["set2-084"],
  cardType: "character",
  name: "Little John",
  version: "Loyal Friend",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "002",
  cardNumber: 84,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_dd74aaf06b6e48c59d8b8e4aea1dcad4",
    tcgPlayer: 527747,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: littleJohnLoyalFriendI18n,
};
