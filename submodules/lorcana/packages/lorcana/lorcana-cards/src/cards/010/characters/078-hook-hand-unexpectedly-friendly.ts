import type { CharacterCard } from "@tcg/lorcana-types";
import { hookHandUnexpectedlyFriendlyI18n } from "./078-hook-hand-unexpectedly-friendly.i18n";

export const hookHandUnexpectedlyFriendly: CharacterCard = {
  id: "80T",
  canonicalId: "ci_80T",
  slug: "lorcana-ci_80T",
  printings: [
    {
      id: "set10-078",
      artId: "set10-078",
      setCode: "set10",
      collectorNumber: "78",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set10-078"],
  cardType: "character",
  name: "Hook Hand",
  version: "Unexpectedly Friendly",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 78,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0c447e6056964c328c30b4ddb32d8148",
    tcgPlayer: "659185",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: hookHandUnexpectedlyFriendlyI18n,
};
