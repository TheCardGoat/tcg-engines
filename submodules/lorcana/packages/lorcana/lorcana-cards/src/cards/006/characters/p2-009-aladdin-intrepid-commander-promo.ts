import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinIntrepidCommanderP2PromoI18n } from "./p2-009-aladdin-intrepid-commander-promo.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const aladdinIntrepidCommanderP2Promo: CharacterCard = {
  id: "j9a",
  canonicalId: "ci_ZSh",
  slug: "lorcana-ci_ZSh",
  printings: [
    {
      id: "set6-p2-009-promo",
      artId: "ci_ZSh-promo",
      setCode: "set6",
      collectorNumber: "9",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-119"],
  cardType: "character",
  name: "Aladdin",
  version: "Intrepid Commander",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 9,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a5acdc20f6a54938be2874ab080a9053",
    tcgPlayer: "588075",
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "REMEMBER YOUR TRAINING",
      description: "When you play this character, your characters get +2 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(2),
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "z1l-2",
      name: "REMEMBER YOUR TRAINING",
      text: "REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: aladdinIntrepidCommanderP2PromoI18n,
};
