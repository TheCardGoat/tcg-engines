import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioStarAttractionI18n } from "./056-pinocchio-star-attraction.i18n";

export const pinocchioStarAttraction: CharacterCard = {
  id: "2SS",
  canonicalId: "ci_2SS",
  slug: "lorcana-ci_2SS",
  printings: [
    {
      id: "set2-056",
      artId: "set2-056",
      setCode: "set2",
      collectorNumber: "56",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set2-056"],
  cardType: "character",
  name: "Pinocchio",
  version: "Star Attraction",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cardNumber: 56,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a32fde4ae1e84354ae7f20d6953d08f0",
    tcgPlayer: "525080",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: pinocchioStarAttractionI18n,
};
