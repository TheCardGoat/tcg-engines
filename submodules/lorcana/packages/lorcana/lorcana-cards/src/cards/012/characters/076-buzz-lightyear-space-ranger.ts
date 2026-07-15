import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearSpaceRangerI18n } from "./076-buzz-lightyear-space-ranger.i18n";

export const buzzLightyearSpaceRanger: CharacterCard = {
  id: "Gb4",
  canonicalId: "ci_Gb4",
  slug: "lorcana-ci_Gb4",
  printings: [
    {
      id: "set12-076",
      artId: "set12-076",
      setCode: "set12",
      collectorNumber: "76",
      rarity: "common",
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
  cardNumber: 76,
  rarity: "common",
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
  i18n: buzzLightyearSpaceRangerI18n,
};
