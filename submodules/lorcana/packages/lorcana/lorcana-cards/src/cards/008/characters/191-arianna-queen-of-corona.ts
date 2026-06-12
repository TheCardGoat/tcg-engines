import type { CharacterCard } from "@tcg/lorcana-types";
import { ariannaQueenOfCoronaI18n } from "./191-arianna-queen-of-corona.i18n";

export const ariannaQueenOfCorona: CharacterCard = {
  id: "vpw",
  canonicalId: "ci_vpw",
  reprints: ["set8-191"],
  cardType: "character",
  name: "Arianna",
  version: "Queen of Corona",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "008",
  cardNumber: 191,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1168e8040a86449695383ef10c9daa2e",
    tcgPlayer: 631475,
  },
  classifications: ["Storyborn", "Queen"],
  i18n: ariannaQueenOfCoronaI18n,
};
