import type { CharacterCard } from "@tcg/lorcana-types";
import { reckless } from "../../ability-helpers";

export const teKTheBurningOne: CharacterCard = {
  id: "14n",
  cardType: "character",
  name: "Te Kā",
  version: "The Burning One",
  fullName: "Te Kā - The Burning One",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 6,
  strength: 8,
  willpower: 6,
  lore: 0,
  cardNumber: 126,
  inkable: false,
  externalIds: {
    ravensburger: "92788505267291d061bce171dae43b361f5c9eca",
  },
  abilities: [reckless("14n-1")],
  classifications: ["Storyborn", "Villain", "Deity"],
};
