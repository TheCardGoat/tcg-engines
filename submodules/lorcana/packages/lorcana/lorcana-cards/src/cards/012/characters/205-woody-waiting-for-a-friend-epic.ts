import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyWaitingForAFriendEpicI18n } from "./205-woody-waiting-for-a-friend-epic.i18n";
import { woodyWaitingForAFriend } from "./003-woody-waiting-for-a-friend";

export const woodyWaitingForAFriendEpic: CharacterCard = {
  ...woodyWaitingForAFriend,
  id: "EEV",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  i18n: woodyWaitingForAFriendEpicI18n,
};
