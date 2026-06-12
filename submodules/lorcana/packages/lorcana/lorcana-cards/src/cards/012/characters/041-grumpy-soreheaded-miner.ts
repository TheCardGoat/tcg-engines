import type { CharacterCard } from "@tcg/lorcana-types";
import { grumpySoreheadedMinerI18n } from "./041-grumpy-soreheaded-miner.i18n";

export const grumpySoreheadedMiner: CharacterCard = {
  id: "Y0q",
  canonicalId: "ci_Y0q",
  reprints: ["set12-041"],
  cardType: "character",
  name: "Grumpy",
  version: "Soreheaded Miner",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 41,
  rarity: "common",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a9a5823df9c842cc91a3cc8ea1d9b4dd",
  },
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  i18n: grumpySoreheadedMinerI18n,
};
