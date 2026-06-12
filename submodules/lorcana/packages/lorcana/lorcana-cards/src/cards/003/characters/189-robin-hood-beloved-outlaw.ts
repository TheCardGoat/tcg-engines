import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodBelovedOutlawI18n } from "./189-robin-hood-beloved-outlaw.i18n";

export const robinHoodBelovedOutlaw: CharacterCard = {
  id: "1k5",
  canonicalId: "ci_1k5",
  reprints: ["set3-189"],
  cardType: "character",
  name: "Robin Hood",
  version: "Beloved Outlaw",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 189,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_69258eaba19a498182c2e4039c89466d",
    tcgPlayer: 537937,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: robinHoodBelovedOutlawI18n,
};
