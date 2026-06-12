import type { CharacterCard } from "@tcg/lorcana-types";
import { bigMamaCleverAndCalmingI18n } from "./071-big-mama-clever-and-calming.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const bigMamaCleverAndCalming: CharacterCard = {
  id: "vUl",
  canonicalId: "ci_vUl",
  reprints: ["set11-071"],
  cardType: "character",
  name: "Big Mama",
  version: "Clever and Calming",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_692e18212e974f8e808f8a8dc45169a8",
    tcgPlayer: 676196,
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally"],
  abilities: [ward],
  i18n: bigMamaCleverAndCalmingI18n,
};
