import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelEtherealProtectorI18n } from "./171-rapunzel-ethereal-protector.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const rapunzelEtherealProtector: CharacterCard = {
  id: "Jsw",
  canonicalId: "ci_eFW",
  reprints: ["set11-171"],
  cardType: "character",
  name: "Rapunzel",
  version: "Ethereal Protector",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "011",
  cardNumber: 171,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b3924beae9a04927adc0e542f5656aa0",
    tcgPlayer: 677157,
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
  i18n: rapunzelEtherealProtectorI18n,
};
