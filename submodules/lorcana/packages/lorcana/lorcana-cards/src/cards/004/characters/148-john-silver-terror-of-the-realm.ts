import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSilverTerrorOfTheRealmI18n } from "./148-john-silver-terror-of-the-realm.i18n";

export const johnSilverTerrorOfTheRealm: CharacterCard = {
  id: "z4o",
  canonicalId: "ci_z4o",
  slug: "lorcana-ci_z4o",
  printings: [
    {
      id: "set4-148",
      artId: "set4-148",
      setCode: "set4",
      collectorNumber: "148",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set4-148"],
  cardType: "character",
  name: "John Silver",
  version: "Terror of the Realm",
  inkType: ["sapphire"],
  franchise: "Treasure Planet",
  set: "004",
  cardNumber: 148,
  rarity: "rare",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_08cbc914c0634bae8d6932b81f7bcdcb",
    tcgPlayer: "550608",
  },
  classifications: ["Dreamborn", "Villain", "Alien", "Pirate", "Captain"],
  i18n: johnSilverTerrorOfTheRealmI18n,
};
