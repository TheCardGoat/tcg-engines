import type { CharacterCard } from "@tcg/lorcana-types";
import { genieCrampedInTheLampI18n } from "./141-genie-cramped-in-the-lamp.i18n";

export const genieCrampedInTheLamp: CharacterCard = {
  id: "rD1",
  canonicalId: "ci_rD1",
  reprints: ["set3-141"],
  cardType: "character",
  name: "Genie",
  version: "Cramped in the Lamp",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 141,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_c978412b40d24029866de7fb2c2218ee",
    tcgPlayer: 539095,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: genieCrampedInTheLampI18n,
};
