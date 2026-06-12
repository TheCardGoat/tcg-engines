import type { CharacterCard } from "@tcg/lorcana-types";
import { kodaSmallishBearI18n } from "./034-koda-smallish-bear.i18n";

export const kodaSmallishBear: CharacterCard = {
  id: "5gA",
  canonicalId: "ci_5gA",
  reprints: ["set7-034"],
  cardType: "character",
  name: "Koda",
  version: "Smallish Bear",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "007",
  cardNumber: 34,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2b6ec7f6dfed481bbc57c510928c657b",
    tcgPlayer: 618719,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: kodaSmallishBearI18n,
};
