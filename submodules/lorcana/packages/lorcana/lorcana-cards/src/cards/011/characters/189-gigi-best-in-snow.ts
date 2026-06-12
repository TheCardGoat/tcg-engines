import type { CharacterCard } from "@tcg/lorcana-types";
import { gigiBestInSnowI18n } from "./189-gigi-best-in-snow.i18n";
import { alert } from "../../../helpers/abilities/alert";

export const gigiBestInSnow: CharacterCard = {
  id: "keA",
  canonicalId: "ci_keA",
  reprints: ["set11-189"],
  cardType: "character",
  name: "Gigi",
  version: "Best in Snow",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 189,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a1e3f0b6249140fcbab13e33ef76fba8",
    tcgPlayer: 676243,
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
    {
      title: "SO PRETTY",
      description: "While this character has no damage, she gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Alien"],
  abilities: [
    alert,
    {
      id: "5r3-2",
      name: "SO PRETTY",
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "SO PRETTY While this character has no damage, she gets +2 {S}.",
    },
  ],
  i18n: gigiBestInSnowI18n,
};
