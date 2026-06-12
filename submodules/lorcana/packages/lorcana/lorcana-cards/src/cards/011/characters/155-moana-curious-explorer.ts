import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaCuriousExplorerI18n } from "./155-moana-curious-explorer.i18n";

export const moanaCuriousExplorer: CharacterCard = {
  id: "wRv",
  canonicalId: "ci_sp0",
  reprints: ["set11-155"],
  cardType: "character",
  name: "Moana",
  version: "Curious Explorer",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 155,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b73d08030c9646ab8a227158b8e453d4",
    tcgPlayer: 673300,
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
  i18n: moanaCuriousExplorerI18n,
};
