import type { CharacterCard } from "@tcg/lorcana-types";
import { nalaMischievousCubP2ChallengeI18n } from "./p2-003-nala-mischievous-cub-challenge.i18n";

export const nalaMischievousCubP2Challenge: CharacterCard = {
  id: "LZw",
  canonicalId: "ci_HeX",
  slug: "lorcana-ci_HeX",
  printings: [
    {
      id: "set5-p2-003-challenge",
      artId: "ci_HeX-challenge",
      setCode: "set5",
      collectorNumber: "3",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-002"],
  cardType: "character",
  name: "Nala",
  version: "Mischievous Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 3,
  rarity: "special",
  specialRarity: "challenge",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_deac8b7b6b514e84a8df865184e81220",
    tcgPlayer: "561996",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: nalaMischievousCubP2ChallengeI18n,
};
