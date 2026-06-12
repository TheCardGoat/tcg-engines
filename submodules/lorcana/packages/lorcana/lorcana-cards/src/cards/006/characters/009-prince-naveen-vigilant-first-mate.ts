import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenVigilantFirstMateI18n } from "./009-prince-naveen-vigilant-first-mate.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { shift } from "../../../helpers/abilities/shift";

export const princeNaveenVigilantFirstMate: CharacterCard = {
  id: "rPA",
  canonicalId: "ci_rPA",
  reprints: ["set6-009"],
  cardType: "character",
  name: "Prince Naveen",
  version: "Vigilant First Mate",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 9,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_39972f3e75a3417488662b70443b3164",
    tcgPlayer: 592016,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Bodyguard",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [shift(3), bodyguard],
  i18n: princeNaveenVigilantFirstMateI18n,
};
