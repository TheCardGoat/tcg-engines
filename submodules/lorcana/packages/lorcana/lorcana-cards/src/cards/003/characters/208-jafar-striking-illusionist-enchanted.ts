import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarStrikingIllusionist } from "./042-jafar-striking-illusionist";

export const jafarStrikingIllusionistEnchanted: CharacterCard = {
  ...jafarStrikingIllusionist,
  id: "MT1",
  reprints: ["set3-042"],
  set: "003",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_3ecab24376cb4cd5989309e000f797c1",
    tcgPlayer: 539158,
  },
};
