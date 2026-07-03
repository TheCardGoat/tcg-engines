import type { CharacterCard } from "@tcg/lorcana-types";
import { copperCreativeStorytellerI18n } from "./090-copper-creative-storyteller.i18n";

export const copperCreativeStoryteller: CharacterCard = {
  id: "7VX",
  canonicalId: "ci_7VX",
  slug: "lorcana-ci_7VX",
  printings: [
    {
      id: "set13-090",
      artId: "set13-090",
      setCode: "set13",
      collectorNumber: "90",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-090"],
  cardType: "character",
  name: "Copper",
  version: "Creative Storyteller",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "013",
  cardNumber: 90,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b9398a559c3b428886334b84cdd3425a",
  },
  classifications: ["Storyborn", "Hero", "Puppy"],
  i18n: copperCreativeStorytellerI18n,
};
