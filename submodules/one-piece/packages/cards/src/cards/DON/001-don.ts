import type { DonCard } from "@tcg/op-types";
import { don001I18n } from "./001-don.i18n.ts";

export const don001: DonCard = {
  id: "DON-001",
  canonicalId: "DON-001",
  slug: "don",
  name: "DON!!",
  printings: [
    {
      id: "DON-001",
      artId: "DON-001",
      setCode: "DON",
      collectorNumber: "001",
      rarity: "DON",
      imageUrl: "https://cdn.tcg.online/public/one-piece/cards/DON/DON-001.webp",
    },
  ],
  cardType: "don",
  color: [],
  rarity: "DON",
  setId: "DON",
  i18n: don001I18n,
};
