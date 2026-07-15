import type { CharacterCard } from "@tcg/lorcana-types";
import { napoleonCleverBloodhoundI18n } from "./096-napoleon-clever-bloodhound.i18n";

export const napoleonCleverBloodhound: CharacterCard = {
  id: "BpJ",
  canonicalId: "ci_BpJ",
  slug: "lorcana-ci_BpJ",
  printings: [
    {
      id: "set8-096",
      artId: "set8-096",
      setCode: "set8",
      collectorNumber: "96",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set8-096"],
  cardType: "character",
  name: "Napoleon",
  version: "Clever Bloodhound",
  inkType: ["emerald"],
  franchise: "Aristocats",
  set: "008",
  cardNumber: 96,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7c16b96741d041d9875c2cb270ab5fc2",
    tcgPlayer: "631690",
  },
  classifications: ["Storyborn"],
  i18n: napoleonCleverBloodhoundI18n,
};
