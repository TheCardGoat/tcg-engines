import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelEtherealProtectorPD1PromoI18n } from "./pd1-002-rapunzel-ethereal-protector-promo.i18n";

import { boost } from "../../../helpers/abilities/boost";

export const rapunzelEtherealProtectorPD1Promo: CharacterCard = {
  id: "u0F",
  canonicalId: "ci_rPJ",
  slug: "lorcana-ci_rPJ",
  printings: [
    {
      id: "set11-pd1-002-promo",
      artId: "ci_rPJ-promo",
      setCode: "set11",
      collectorNumber: "2",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set11-171"],
  cardType: "character",
  name: "Rapunzel",
  version: "Ethereal Protector",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "011",
  cardNumber: 2,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b3924beae9a04927adc0e542f5656aa0",
    tcgPlayer: "677157",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "CLONK!",
      description:
        "Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
  abilities: [
    boost(2),
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        restriction: "cant-challenge",
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "their-next-turn",
        type: "restriction",
      },
      id: "Jsw-2",
      name: "CLONK!",
      text: "CLONK! Whenever this character quests, if there's a card under her, chosen opposing character can't challenge until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelEtherealProtectorPD1PromoI18n,
};
