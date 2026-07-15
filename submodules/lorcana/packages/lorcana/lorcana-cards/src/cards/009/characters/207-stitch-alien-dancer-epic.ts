import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienDancerEpicI18n } from "./207-stitch-alien-dancer-epic.i18n";

export const stitchAlienDancerEpic: CharacterCard = {
  id: "EvJ",
  canonicalId: "ci_xxV",
  slug: "lorcana-ci_xxV",
  printings: [
    {
      id: "set9-207-epic",
      artId: "ci_xxV-epic",
      setCode: "set9",
      collectorNumber: "207",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-023", "set9-009"],
  cardType: "character",
  name: "Stitch",
  version: "Alien Dancer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "009",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6ccc388f32064927a08d9914aad4bc8f",
    tcgPlayer: "650143",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
  i18n: stitchAlienDancerEpicI18n,
};
