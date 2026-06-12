import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereHotheadedCandelabraI18n } from "./112-lumiere-hotheaded-candelabra.i18n";

export const lumiereHotheadedCandelabra: CharacterCard = {
  id: "3B5",
  canonicalId: "ci_3B5",
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
    tcgPlayer: 525111,
  },
  classifications: ["Dreamborn", "Ally"],
  i18n: lumiereHotheadedCandelabraI18n,
};
