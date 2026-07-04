import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearSpaceRangerEpicI18n } from "./211-buzz-lightyear-space-ranger-epic.i18n";

export const buzzLightyearSpaceRangerEpic: CharacterCard = {
  id: "XE1",
  canonicalId: "ci_Gb4",
  slug: "lorcana-ci_Gb4",
  printings: [
    {
      id: "set12-211-epic",
      artId: "ci_Gb4-epic",
      setCode: "set12",
      collectorNumber: "211",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set12-076"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "Space Ranger",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 211,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_dc61d69860c541f6bca41a4a9b8c17f1",
    tcgPlayer: "692208",
  },
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  i18n: buzzLightyearSpaceRangerEpicI18n,
};
