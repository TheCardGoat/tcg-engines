import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckNephewFredI18n } from "./105-donald-duck-nephew-fred.i18n";

export const donaldDuckNephewFred: CharacterCard = {
  id: "Sjs",
  canonicalId: "ci_Sjs",
  reprints: ["set11-105"],
  cardType: "character",
  name: "Donald Duck",
  version: "Nephew Fred",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 105,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_39f53f01a4b948a886a82a0c6bf742a3",
    tcgPlayer: 675405,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: donaldDuckNephewFredI18n,
};
