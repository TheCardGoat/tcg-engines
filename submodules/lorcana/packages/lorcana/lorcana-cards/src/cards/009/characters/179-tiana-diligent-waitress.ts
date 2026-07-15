import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaDiligentWaitressI18n } from "./179-tiana-diligent-waitress.i18n";

export const tianaDiligentWaitress: CharacterCard = {
  id: "hYV",
  canonicalId: "ci_ni7",
  slug: "lorcana-ci_ni7",
  printings: [
    {
      id: "set9-179",
      artId: "set9-179",
      setCode: "set9",
      collectorNumber: "179",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-197", "set9-179"],
  cardType: "character",
  name: "Tiana",
  version: "Diligent Waitress",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "009",
  cardNumber: 179,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_1843141c81254b5bb5dd3dfc7cc624dc",
    tcgPlayer: "650112",
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: tianaDiligentWaitressI18n,
};
