import type { CharacterCard } from "@tcg/lorcana-types";
import { horaceNogoodScoundrelI18n } from "./079-horace-no-good-scoundrel.i18n";

export const horaceNogoodScoundrel: CharacterCard = {
  id: "dBe",
  canonicalId: "ci_dBe",
  reprints: ["set1-079"],
  cardType: "character",
  name: "Horace",
  version: "No-Good Scoundrel",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "001",
  cardNumber: 79,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_449f6f94972b4bce9a87460460204cd8",
    tcgPlayer: 507494,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: horaceNogoodScoundrelI18n,
};
