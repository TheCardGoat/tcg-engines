import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsHasagawaFruitVendorI18n } from "./150-mrs-hasagawa-fruit-vendor.i18n";

export const mrsHasagawaFruitVendor: CharacterCard = {
  id: "iGe",
  canonicalId: "ci_iGe",
  slug: "lorcana-ci_iGe",
  printings: [
    {
      id: "set13-150",
      artId: "set13-150",
      setCode: "set13",
      collectorNumber: "150",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-150"],
  cardType: "character",
  name: "Mrs. Hasagawa",
  version: "Fruit Vendor",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 150,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fa46d57f8eea4d11a0f1a86c62bb4e53",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: mrsHasagawaFruitVendorI18n,
};
