import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseEnthusiasticDancerI18n } from "./112-mickey-mouse-enthusiastic-dancer.i18n";

export const mickeyMouseEnthusiasticDancer: CharacterCard = {
  id: "lzK",
  canonicalId: "ci_lzK",
  reprints: ["set5-112"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Enthusiastic Dancer",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 112,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bc7acdf1831f4c71bbab9e1c2c16f0ff",
    tcgPlayer: 557293,
  },
  text: [
    {
      title: "PERFECT PARTNERS",
      description:
        "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Minnie Mouse",
        type: "has-named-character",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "18m-1",
      name: "PERFECT PARTNERS",
      text: "PERFECT PARTNERS While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: mickeyMouseEnthusiasticDancerI18n,
};
