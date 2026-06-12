import type { CharacterCard } from "@tcg/lorcana-types";
import { billyBonesKeeperOfTheMapI18n } from "./104-billy-bones-keeper-of-the-map.i18n";

export const billyBonesKeeperOfTheMap: CharacterCard = {
  id: "Wmg",
  canonicalId: "ci_Wmg",
  reprints: ["set3-104"],
  cardType: "character",
  name: "Billy Bones",
  version: "Keeper of the Map",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 104,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_962d3a1f68d842a2818db2f230723b87",
    tcgPlayer: 539087,
  },
  classifications: ["Storyborn", "Alien", "Pirate"],
  i18n: billyBonesKeeperOfTheMapI18n,
};
