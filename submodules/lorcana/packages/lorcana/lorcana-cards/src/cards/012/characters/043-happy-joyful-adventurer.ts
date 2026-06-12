import type { CharacterCard } from "@tcg/lorcana-types";
import { happyJoyfulAdventurerI18n } from "./043-happy-joyful-adventurer.i18n";

export const happyJoyfulAdventurer: CharacterCard = {
  id: "lOO",
  canonicalId: "ci_lOO",
  reprints: ["set12-043"],
  cardType: "character",
  name: "Happy",
  version: "Joyful Adventurer",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 43,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_19f9cb6d8ec14727aecb704c3d5c1c14",
  },
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
  i18n: happyJoyfulAdventurerI18n,
};
