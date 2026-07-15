import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseDaringDefenderP2PromoI18n } from "./p2-035-minnie-mouse-daring-defender-promo.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const minnieMouseDaringDefenderP2Promo: CharacterCard = {
  id: "92V",
  canonicalId: "ci_hyd",
  slug: "lorcana-ci_hyd",
  printings: [
    {
      id: "set8-p2-035-promo",
      artId: "ci_hyd-promo",
      setCode: "set8",
      collectorNumber: "35",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set8-006"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Daring Defender",
  inkType: ["amber", "ruby"],
  set: "008",
  cardNumber: 35,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 0,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_693ec0809a974a8ba6ce2a5b3a29f209",
    tcgPlayer: "631352",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "TRUE VALOR",
      description: "This character gets +1 {S} for each 1 damage on her.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    bodyguard,
    {
      effect: {
        modifier: {
          type: "damage-on-self",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "7k3-2",
      name: "TRUE VALOR",
      text: "TRUE VALOR This character gets +1 {S} for each 1 damage on her.",
      type: "static",
    },
  ],
  i18n: minnieMouseDaringDefenderP2PromoI18n,
};
