import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchCleverCartographerI18n } from "./079-milo-thatch-clever-cartographer.i18n";

export const miloThatchCleverCartographer: CharacterCard = {
  id: "NSM",
  canonicalId: "ci_NSM",
  reprints: ["set3-079"],
  cardType: "character",
  name: "Milo Thatch",
  version: "Clever Cartographer",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 79,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8745424825aa4fa6840fbb0a19711247",
    tcgPlayer: 536280,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: miloThatchCleverCartographerI18n,
};
