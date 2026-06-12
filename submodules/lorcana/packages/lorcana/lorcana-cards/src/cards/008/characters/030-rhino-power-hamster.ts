import type { CharacterCard } from "@tcg/lorcana-types";
import { rhinoPowerHamsterI18n } from "./030-rhino-power-hamster.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const rhinoPowerHamster: CharacterCard = {
  id: "I1B",
  canonicalId: "ci_I1B",
  reprints: ["set8-030"],
  cardType: "character",
  name: "Rhino",
  version: "Power Hamster",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  cardNumber: 30,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b7d241314eca4aa2b268c00cd4dde064",
    tcgPlayer: 631700,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "EPIC BALL OF AWESOME",
      description: "While this character has no damage, he gains Resist +2.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(2),
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "g5c-2",
      name: "EPIC BALL OF AWESOME",
      text: "EPIC BALL OF AWESOME While this character has no damage, he gains Resist +2.",
      type: "static",
    },
  ],
  i18n: rhinoPowerHamsterI18n,
};
