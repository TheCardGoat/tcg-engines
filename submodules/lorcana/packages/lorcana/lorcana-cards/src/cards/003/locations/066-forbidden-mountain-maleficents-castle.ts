import type { LocationCard } from "@tcg/lorcana-types";
import { forbiddenMountainMaleficentsCastleI18n } from "./066-forbidden-mountain-maleficents-castle.i18n";

export const forbiddenMountainMaleficentsCastle: LocationCard = {
  id: "189",
  canonicalId: "ci_189",
  reprints: ["set3-066"],
  cardType: "location",
  name: "Forbidden Mountain",
  version: "Maleficent's Castle",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  cardNumber: 66,
  rarity: "common",
  cost: 2,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5ac4816ce7b240db942b5963a8db9909",
    tcgPlayer: 531821,
  },
  i18n: forbiddenMountainMaleficentsCastleI18n,
};
