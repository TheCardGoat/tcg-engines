import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraHoldingCourtI18n } from "./006-aurora-holding-court.i18n";

export const auroraHoldingCourt: CharacterCard = {
  id: "udr",
  canonicalId: "ci_qjl",
  reprints: ["set9-006"],
  cardType: "character",
  name: "Aurora",
  version: "Holding Court",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "009",
  cardNumber: 6,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d292fcaa144d4f739bda2c14948da2ce",
    tcgPlayer: 650142,
  },
  text: [
    {
      title: "ROYAL WELCOME",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "character",
        classification: ["Princess", "Queen"],
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1dm-1",
      name: "ROYAL WELCOME",
      text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: auroraHoldingCourtI18n,
};
