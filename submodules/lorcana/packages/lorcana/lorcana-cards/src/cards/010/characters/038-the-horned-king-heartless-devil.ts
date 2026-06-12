import type { CharacterCard } from "@tcg/lorcana-types";
import { theHornedKingHeartlessDevilI18n } from "./038-the-horned-king-heartless-devil.i18n";

export const theHornedKingHeartlessDevil: CharacterCard = {
  id: "ETS",
  canonicalId: "ci_ETS",
  reprints: ["set10-038"],
  cardType: "character",
  name: "The Horned King",
  version: "Heartless Devil",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 38,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_f2535ab8555e4cc3bcd5cf3f5ff022e1",
    tcgPlayer: 657896,
  },
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
  i18n: theHornedKingHeartlessDevilI18n,
};
