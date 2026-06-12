import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckBoisterousFowlI18n } from "./108-donald-duck-boisterous-fowl.i18n";

export const donaldDuckBoisterousFowl: CharacterCard = {
  id: "Blq",
  canonicalId: "ci_Blq",
  reprints: ["set1-108"],
  cardType: "character",
  name: "Donald Duck",
  version: "Boisterous Fowl",
  inkType: ["ruby"],
  set: "001",
  cardNumber: 108,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9db4390c3200400db02bf38305508d38",
    tcgPlayer: 493487,
  },
  classifications: ["Storyborn"],
  i18n: donaldDuckBoisterousFowlI18n,
};
