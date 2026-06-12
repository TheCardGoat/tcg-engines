import type { CharacterCard } from "@tcg/lorcana-types";
import { nalaMischievousCubI18n } from "./002-nala-mischievous-cub.i18n";

export const nalaMischievousCub: CharacterCard = {
  id: "HeX",
  canonicalId: "ci_HeX",
  reprints: ["set5-002"],
  cardType: "character",
  name: "Nala",
  version: "Mischievous Cub",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 2,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_deac8b7b6b514e84a8df865184e81220",
    tcgPlayer: 561996,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: nalaMischievousCubI18n,
};
