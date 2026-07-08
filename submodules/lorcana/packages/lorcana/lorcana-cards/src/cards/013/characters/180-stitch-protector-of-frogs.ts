import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchProtectorOfFrogsI18n } from "./180-stitch-protector-of-frogs.i18n";

export const stitchProtectorOfFrogs: CharacterCard = {
  id: "kT3",
  canonicalId: "ci_kT3",
  slug: "lorcana-ci_kT3",
  printings: [
    {
      id: "set13-180",
      artId: "set13-180",
      setCode: "set13",
      collectorNumber: "180",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-180"],
  cardType: "character",
  name: "Stitch",
  version: "Protector of Frogs",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 180,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8563c315711c4f45828a59cfdde2a31f",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
  i18n: stitchProtectorOfFrogsI18n,
};
