import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleBobParrEpicI18n } from "./215-mr-incredible-bob-parr-epic.i18n";

export const mrIncredibleBobParrEpic: CharacterCard = {
  id: "ndv",
  canonicalId: "ci_MpT",
  slug: "lorcana-ci_MpT",
  printings: [
    {
      id: "set12-215-epic",
      artId: "ci_MpT-epic",
      setCode: "set12",
      collectorNumber: "215",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-104"],
  cardType: "character",
  name: "Mr. Incredible",
  version: "Bob Parr",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 215,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_04e84b2e5eca458da5e3ce89ac7b19cb",
    tcgPlayer: "692211",
  },
  classifications: ["Storyborn", "Super", "Hero"],
  i18n: mrIncredibleBobParrEpicI18n,
};
