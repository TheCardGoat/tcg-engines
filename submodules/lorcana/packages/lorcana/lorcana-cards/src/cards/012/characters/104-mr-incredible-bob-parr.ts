import type { CharacterCard } from "@tcg/lorcana-types";
import { mrIncredibleBobParrI18n } from "./104-mr-incredible-bob-parr.i18n";

export const mrIncredibleBobParr: CharacterCard = {
  id: "MpT",
  canonicalId: "ci_MpT",
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
    lorcast: "crd_89a70d23433346ac879702a68882a0e4",
  },
  classifications: ["Storyborn", "Super", "Hero"],
  i18n: mrIncredibleBobParrI18n,
};
