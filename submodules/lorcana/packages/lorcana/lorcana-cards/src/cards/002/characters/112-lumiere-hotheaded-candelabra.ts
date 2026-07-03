import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereHotheadedCandelabraI18n } from "./112-lumiere-hotheaded-candelabra.i18n";

export const lumiereHotheadedCandelabra: CharacterCard = {
  id: "3B5",
  canonicalId: "ci_3B5",
  slug: "lorcana-ci_3B5",
  printings: [
    {
      id: "set2-112",
      artId: "set2-112",
      setCode: "set2",
      collectorNumber: "112",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set2-112"],
  cardType: "character",
  name: "Lumiere",
  version: "Hotheaded Candelabra",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 112,
  rarity: "rare",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_78adb82131a54205b5ba3cef451bee00",
    tcgPlayer: "525111",
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: lumiereHotheadedCandelabraI18n,
};
