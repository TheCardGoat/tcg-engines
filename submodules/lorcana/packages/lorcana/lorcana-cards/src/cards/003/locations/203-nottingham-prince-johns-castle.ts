import type { LocationCard } from "@tcg/lorcana-types";
import { nottinghamPrinceJohnsCastleI18n } from "./203-nottingham-prince-johns-castle.i18n";

export const nottinghamPrinceJohnsCastle: LocationCard = {
  id: "cHC",
  canonicalId: "ci_cHC",
  reprints: ["set3-203"],
  cardType: "location",
  name: "Nottingham",
  version: "Prince John's Castle",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 203,
  rarity: "common",
  cost: 2,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_398194a72dfd4e41be4b6939e4e13ee3",
    tcgPlayer: 539118,
  },
  i18n: nottinghamPrinceJohnsCastleI18n,
};
