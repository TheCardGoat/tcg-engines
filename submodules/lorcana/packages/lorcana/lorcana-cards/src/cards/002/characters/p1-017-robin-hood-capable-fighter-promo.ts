import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCapableFighterP1PromoI18n } from "./p1-017-robin-hood-capable-fighter-promo.i18n";

export const robinHoodCapableFighterP1Promo: CharacterCard = {
  id: "2b1",
  canonicalId: "ci_Puv",
  slug: "lorcana-ci_Puv",
  printings: [
    {
      id: "set2-p1-017-promo",
      artId: "ci_Puv-promo",
      setCode: "set2",
      collectorNumber: "17",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set2-193", "set9-184"],
  cardType: "character",
  name: "Robin Hood",
  version: "Capable Fighter",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "002",
  cardNumber: 17,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_888f26474eba4f569f94c99251eddf06",
    tcgPlayer: "650155",
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
  i18n: robinHoodCapableFighterP1PromoI18n,
};
