import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoMickeysCleverFriendI18n } from "./152-pluto-mickeys-clever-friend.i18n";

export const plutoMickeysCleverFriend: CharacterCard = {
  id: "bHm",
  canonicalId: "ci_bHm",
  reprints: ["set3-152"],
  cardType: "character",
  name: "Pluto",
  version: "Mickey's Clever Friend",
  inkType: ["sapphire"],
  set: "003",
  cardNumber: 152,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_936d98ea79ba4a54bd3ef0a166ce6875",
    tcgPlayer: 539099,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: plutoMickeysCleverFriendI18n,
};
