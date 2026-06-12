import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCapableFighterI18n } from "./193-robin-hood-capable-fighter.i18n";

export const robinHoodCapableFighter: CharacterCard = {
  id: "4Zj",
  canonicalId: "ci_YvC",
  reprints: ["set2-193", "set9-184"],
  cardType: "character",
  name: "Robin Hood",
  version: "Capable Fighter",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "002",
  cardNumber: 193,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_888f26474eba4f569f94c99251eddf06",
    tcgPlayer: 650155,
  },
  text: [
    {
      title: "SKIRMISH",
      description: "{E} — Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "qi2-1",
      name: "SKIRMISH",
      text: "SKIRMISH {E} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  i18n: robinHoodCapableFighterI18n,
};
