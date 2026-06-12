import type { CharacterCard } from "@tcg/lorcana-types";
import { shenziScarsAccompliceI18n } from "./070-shenzi-scars-accomplice.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const shenziScarsAccomplice: CharacterCard = {
  id: "NoM",
  canonicalId: "ci_NoM",
  reprints: ["set5-070"],
  cardType: "character",
  name: "Shenzi",
  version: "Scar's Accomplice",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  cardNumber: 70,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e736ff0f31bb455992c5ba93c4875444",
    tcgPlayer: 561955,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "EASY PICKINGS",
      description: "While challenging a damaged character, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
  abilities: [
    evasive,
    {
      condition: {
        role: "attacker",
        type: "in-challenge",
        againstDamaged: true,
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: {
          ref: "self",
        },
        type: "modify-stat",
      },
      id: "1nr-2",
      name: "EASY PICKINGS",
      text: "EASY PICKINGS While challenging a damaged character, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: shenziScarsAccompliceI18n,
};
