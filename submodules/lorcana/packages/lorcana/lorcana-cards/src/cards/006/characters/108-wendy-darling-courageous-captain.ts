import type { CharacterCard } from "@tcg/lorcana-types";
import { wendyDarlingCourageousCaptainI18n } from "./108-wendy-darling-courageous-captain.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const wendyDarlingCourageousCaptain: CharacterCard = {
  id: "AYJ",
  canonicalId: "ci_AYJ",
  reprints: ["set6-108"],
  cardType: "character",
  name: "Wendy Darling",
  version: "Courageous Captain",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 108,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f0088a27ad794105a7a6858c5f32e3a8",
    tcgPlayer: 582540,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "LOOK LIVELY, CREW!",
      description:
        "While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    evasive,
    {
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "or-more",
        count: 2,
        classification: "Pirate",
      },
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1dv-2",
      name: "LOOK LIVELY, CREW!",
      text: "LOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
      type: "static",
    },
    {
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "or-more",
        count: 2,
        classification: "Pirate",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1dv-3",
      name: "LOOK LIVELY, CREW!",
      text: "LOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
      type: "static",
    },
  ],
  i18n: wendyDarlingCourageousCaptainI18n,
};
