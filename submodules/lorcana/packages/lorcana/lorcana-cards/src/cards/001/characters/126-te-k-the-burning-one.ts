import type { CharacterCard } from "@tcg/lorcana-types";
import { teKTheBurningOneI18n } from "./126-te-k-the-burning-one.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const teKTheBurningOne: CharacterCard = {
  id: "Zd7",
  canonicalId: "ci_Zd7",
  reprints: ["set1-126"],
  cardType: "character",
  name: "Te Kā",
  version: "The Burning One",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  cardNumber: 126,
  rarity: "common",
  cost: 6,
  strength: 8,
  willpower: 6,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_e70380b0a938449cb7e2b433737ec824",
    tcgPlayer: 508803,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [reckless],
  i18n: teKTheBurningOneI18n,
};
