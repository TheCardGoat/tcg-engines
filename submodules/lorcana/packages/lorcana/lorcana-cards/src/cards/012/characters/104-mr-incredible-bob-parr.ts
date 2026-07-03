import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleBobParrI18n } from "./104-mr-incredible-bob-parr.i18n";

export const mrIncredibleBobParr: CharacterCard = {
  id: "MpT",
  canonicalId: "ci_MpT",
  slug: "lorcana-ci_MpT",
  printings: [
    {
      id: "set12-104",
      artId: "set12-104",
      setCode: "set12",
      collectorNumber: "104",
      rarity: "common",
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
  cardNumber: 104,
  rarity: "common",
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
  i18n: mrIncredibleBobParrI18n,
};
