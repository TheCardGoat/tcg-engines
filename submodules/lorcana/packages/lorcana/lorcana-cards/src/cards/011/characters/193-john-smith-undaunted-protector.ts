import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSmithUndauntedProtectorI18n } from "./193-john-smith-undaunted-protector.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const johnSmithUndauntedProtector: CharacterCard = {
  id: "h1O",
  canonicalId: "ci_h1O",
  reprints: ["set11-193"],
  cardType: "character",
  name: "John Smith",
  version: "Undaunted Protector",
  inkType: ["steel"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 193,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_26b1e9d58acf429aa2d77f89f6534c16",
    tcgPlayer: 676245,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "DO YOUR WORST",
      description: "Opponents must choose this character for actions and abilities if able.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    bodyguard,
    {
      id: "h1O-2",
      name: "DO YOUR WORST",
      type: "static",
      text: "DO YOUR WORST Opponents must choose this character for actions and abilities if able.",
      effect: {
        type: "restriction",
        target: "SELF",
        restriction: "must-be-chosen-for-effects",
      },
    },
  ],
  i18n: johnSmithUndauntedProtectorI18n,
};
