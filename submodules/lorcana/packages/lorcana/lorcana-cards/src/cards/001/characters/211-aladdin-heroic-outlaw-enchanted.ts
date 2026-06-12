import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinHeroicOutlaw } from "./104-aladdin-heroic-outlaw";

export const aladdinHeroicOutlawEnchanted: CharacterCard = {
  ...aladdinHeroicOutlaw,
  id: "pkU",
  reprints: ["set1-104"],
  set: "001",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_7c621010e3e6471d9916eee4bcd0b11d",
    tcgPlayer: 510157,
  },
};
