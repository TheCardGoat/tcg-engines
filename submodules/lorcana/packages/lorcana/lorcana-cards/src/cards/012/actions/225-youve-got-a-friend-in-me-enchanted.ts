import type { ActionCard } from "@tcg/lorcana-types";
import { youveGotAFriendInMeEnchantedI18n } from "./225-youve-got-a-friend-in-me-enchanted.i18n";
import { youveGotAFriendInMe } from "./030-youve-got-a-friend-in-me";

export const youveGotAFriendInMeEnchanted: ActionCard = {
  ...youveGotAFriendInMe,
  id: "RCw",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  i18n: youveGotAFriendInMeEnchantedI18n,
};
