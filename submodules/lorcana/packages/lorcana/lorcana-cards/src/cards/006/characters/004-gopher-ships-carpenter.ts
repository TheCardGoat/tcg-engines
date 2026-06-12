import type { CharacterCard } from "@tcg/lorcana-types";
import { gopherShipsCarpenterI18n } from "./004-gopher-ships-carpenter.i18n";

export const gopherShipsCarpenter: CharacterCard = {
  id: "y4b",
  canonicalId: "ci_y4b",
  reprints: ["set6-004"],
  cardType: "character",
  name: "Gopher",
  version: "Ship's Carpenter",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 4,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_582917ea24ef4aa4a6921fcbe55d0100",
    tcgPlayer: 591986,
  },
  classifications: ["Storyborn", "Ally", "Pirate"],
  i18n: gopherShipsCarpenterI18n,
};
