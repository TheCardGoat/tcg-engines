import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearSpaceRangerI18n } from "./076-buzz-lightyear-space-ranger.i18n";

export const buzzLightyearSpaceRanger: CharacterCard = {
  id: "Gb4",
  canonicalId: "ci_Gb4",
  reprints: ["set12-076"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "Space Ranger",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 76,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7a1dc3b9b23041a78c7e1b46ff4a2f2c",
  },
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  i18n: buzzLightyearSpaceRangerI18n,
};
