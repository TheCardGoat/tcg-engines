import type { CharacterCard } from "@tcg/lorcana-types";
import { creeperLoyalLackeyI18n } from "./050-creeper-loyal-lackey.i18n";

export const creeperLoyalLackey: CharacterCard = {
  id: "FR8",
  canonicalId: "ci_FR8",
  reprints: ["set10-050"],
  cardType: "character",
  name: "Creeper",
  version: "Loyal Lackey",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 50,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_872fb0e1ed4740b3bac30565ba52e9a2",
    tcgPlayer: 659182,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: creeperLoyalLackeyI18n,
};
