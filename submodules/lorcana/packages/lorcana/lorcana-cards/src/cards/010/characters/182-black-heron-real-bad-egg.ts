import type { CharacterCard } from "@tcg/lorcana-types";
import { blackHeronRealBadEggI18n } from "./182-black-heron-real-bad-egg.i18n";

export const blackHeronRealBadEgg: CharacterCard = {
  id: "2S3",
  canonicalId: "ci_2S3",
  reprints: ["set10-182"],
  cardType: "character",
  name: "Black Heron",
  version: "Real Bad Egg",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 182,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bc05194173e446a8b3e4dc80c1a68962",
    tcgPlayer: 659456,
  },
  classifications: ["Storyborn", "Villain"],
  i18n: blackHeronRealBadEggI18n,
};
