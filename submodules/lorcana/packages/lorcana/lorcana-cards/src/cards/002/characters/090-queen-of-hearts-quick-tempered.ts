import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsQuicktemperedI18n } from "./090-queen-of-hearts-quick-tempered.i18n";

export const queenOfHeartsQuicktempered: CharacterCard = {
  id: "VtO",
  canonicalId: "ci_VtO",
  reprints: ["set2-090"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Quick-Tempered",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 90,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_2f01947ccb4d4bae8b2cda6308a77323",
    tcgPlayer: 525079,
  },
  text: [
    {
      title: "ROYAL RAGE",
      description:
        "When you play this character, deal 1 damage to chosen damaged opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "CHOSEN_OPPOSING_DAMAGED_CHARACTER",
        type: "deal-damage",
      },
      id: "hry-1",
      name: "ROYAL RAGE",
      text: "ROYAL RAGE When you play this character, deal 1 damage to chosen damaged opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: queenOfHeartsQuicktemperedI18n,
};
