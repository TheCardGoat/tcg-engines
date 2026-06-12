import type { CharacterCard } from "@tcg/lorcana-types";
import { bounPrecociousEntrepreneurI18n } from "./104-boun-precocious-entrepreneur.i18n";

export const bounPrecociousEntrepreneur: CharacterCard = {
  id: "POP",
  canonicalId: "ci_POP",
  reprints: ["set2-104"],
  cardType: "character",
  name: "Boun",
  version: "Precocious Entrepreneur",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 104,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5531bbdbce6c4d0b86a40ea6fecac853",
    tcgPlayer: 527753,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: bounPrecociousEntrepreneurI18n,
};
