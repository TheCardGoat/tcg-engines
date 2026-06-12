import type { CharacterCard } from "@tcg/lorcana-types";
import { incrediboyBuddyPineEpicI18n } from "./221-incrediboy-buddy-pine-epic.i18n";
import { incrediboyBuddyPine } from "./177-incrediboy-buddy-pine";

export const incrediboyBuddyPineEpic: CharacterCard = {
  ...incrediboyBuddyPine,
  id: "Uwr",
  cardNumber: 221,
  rarity: "common",
  specialRarity: "epic",
  i18n: incrediboyBuddyPineEpicI18n,
};
