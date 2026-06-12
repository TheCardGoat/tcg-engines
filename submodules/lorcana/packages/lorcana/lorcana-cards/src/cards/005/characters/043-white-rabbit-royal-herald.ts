import type { CharacterCard } from "@tcg/lorcana-types";
import { whiteRabbitRoyalHeraldI18n } from "./043-white-rabbit-royal-herald.i18n";

export const whiteRabbitRoyalHerald: CharacterCard = {
  id: "QPW",
  canonicalId: "ci_QPW",
  reprints: ["set5-043"],
  cardType: "character",
  name: "White Rabbit",
  version: "Royal Herald",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "005",
  cardNumber: 43,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3cc55696a89340ceb63f0ad739644c17",
    tcgPlayer: 561166,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: whiteRabbitRoyalHeraldI18n,
};
