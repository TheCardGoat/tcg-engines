import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseFoodFightDefenderI18n } from "./176-mickey-mouse-food-fight-defender.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const mickeyMouseFoodFightDefender: CharacterCard = {
  id: "z89",
  canonicalId: "ci_z89",
  reprints: ["set5-176"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Food Fight Defender",
  inkType: ["steel"],
  set: "005",
  cardNumber: 176,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3fcdfc49c12743bea7e8f632ba06c41b",
    tcgPlayer: 561848,
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Hero"],
  abilities: [resist(1)],
  i18n: mickeyMouseFoodFightDefenderI18n,
};
