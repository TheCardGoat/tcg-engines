import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienDancerI18n } from "./009-stitch-alien-dancer.i18n";

export const stitchAlienDancer: CharacterCard = {
  id: "1nk",
  canonicalId: "ci_xxV",
  slug: "lorcana-ci_xxV",
  printings: [
    {
      id: "set9-009",
      artId: "set9-009",
      setCode: "set9",
      collectorNumber: "9",
      rarity: "common",
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
  cardNumber: 9,
  rarity: "common",
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
  i18n: stitchAlienDancerI18n,
};
