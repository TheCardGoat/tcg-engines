import type { ItemCard } from "@tcg/lorcana-types";
import { theGlassSlipper } from "./044-the-glass-slipper";

export const theGlassSlipperEnchanted: ItemCard = {
  ...theGlassSlipper,
  id: "DD1",
  reprints: ["set7-044"],
  set: "007",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_aa7db27471b142cfa97cd5ca3409669d",
    tcgPlayer: 619736,
  },
};
