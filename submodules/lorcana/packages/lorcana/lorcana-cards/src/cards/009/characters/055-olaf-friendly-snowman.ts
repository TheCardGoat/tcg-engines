import type { CharacterCard } from "@tcg/lorcana-types";
import { olafFriendlySnowmanI18n } from "./055-olaf-friendly-snowman.i18n";

export const olafFriendlySnowman: CharacterCard = {
  id: "5Zo",
  canonicalId: "ci_fZN",
  slug: "lorcana-ci_fZN",
  printings: [
    {
      id: "set9-055",
      artId: "set9-055",
      setCode: "set9",
      collectorNumber: "55",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-052", "set9-055"],
  cardType: "character",
  name: "Olaf",
  version: "Friendly Snowman",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  cardNumber: 55,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e00da6aac653437aba64ee3268fc29b8",
    tcgPlayer: "649999",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: olafFriendlySnowmanI18n,
};
