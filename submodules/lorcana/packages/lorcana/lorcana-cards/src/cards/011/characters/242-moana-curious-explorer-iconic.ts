import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaCuriousExplorerIconicI18n } from "./242-moana-curious-explorer-iconic.i18n";

export const moanaCuriousExplorerIconic: CharacterCard = {
  id: "Xjj",
  canonicalId: "ci_sp0",
  slug: "lorcana-ci_sp0",
  printings: [
    {
      id: "set11-242-iconic",
      artId: "ci_sp0-iconic",
      setCode: "set11",
      collectorNumber: "242",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-155"],
  cardType: "character",
  name: "Moana",
  version: "Curious Explorer",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 242,
  rarity: "common",
  specialRarity: "iconic",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b73d08030c9646ab8a227158b8e453d4",
    tcgPlayer: "673300",
  },
  text: [
    {
      title: "ANCESTRAL LEGACY",
      description: "You can ink cards from your discard.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "moana-ce-1",
      name: "ANCESTRAL LEGACY",
      text: "ANCESTRAL LEGACY You can ink cards from your discard.",
      type: "static",
      effect: {
        type: "grant-discard-inkability",
      },
    },
  ],
  i18n: moanaCuriousExplorerIconicI18n,
};
