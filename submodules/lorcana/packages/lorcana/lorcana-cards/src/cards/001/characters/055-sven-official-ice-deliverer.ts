import type { CharacterCard } from "@tcg/lorcana-types";
import { svenOfficialIceDelivererI18n } from "./055-sven-official-ice-deliverer.i18n";

export const svenOfficialIceDeliverer: CharacterCard = {
  id: "L7t",
  canonicalId: "ci_Nok",
  reprints: ["set1-055", "set9-056"],
  cardType: "character",
  name: "Sven",
  version: "Official Ice Deliverer",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 55,
  rarity: "uncommon",
  cost: 6,
  strength: 5,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7b8e4758284944abbee5ba2f79d2b353",
    tcgPlayer: 650000,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: svenOfficialIceDelivererI18n,
};
