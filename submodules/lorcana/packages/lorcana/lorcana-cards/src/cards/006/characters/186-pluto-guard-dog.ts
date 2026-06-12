import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoGuardDogI18n } from "./186-pluto-guard-dog.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const plutoGuardDog: CharacterCard = {
  id: "mEY",
  canonicalId: "ci_mEY",
  reprints: ["set6-186"],
  cardType: "character",
  name: "Pluto",
  version: "Guard Dog",
  inkType: ["steel"],
  set: "006",
  cardNumber: 186,
  rarity: "uncommon",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0b42ad3a223046c0a3807f04c58a552e",
    tcgPlayer: 593037,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "BRAVO",
      description: "While this character has no damage, he gets +4 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    bodyguard,
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 4,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "173-2",
      name: "BRAVO",
      text: "BRAVO While this character has no damage, he gets +4 {S}.",
      type: "static",
    },
  ],
  i18n: plutoGuardDogI18n,
};
