import type { CharacterCard } from "@tcg/lorcana-types";
import { theFatesOnlyOneEyeI18n } from "./089-the-fates-only-one-eye.i18n";

export const theFatesOnlyOneEye: CharacterCard = {
  id: "Sh7",
  canonicalId: "ci_Sh7",
  reprints: ["set4-089"],
  cardType: "character",
  name: "The Fates",
  version: "Only One Eye",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 89,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cd05e8e7bb5c434cba3487e6f2aaf7ed",
    tcgPlayer: 550582,
  },
  text: [
    {
      title: "ALL WILL BE SEEN",
      description: "When you play this character, look at the top card of each opponent's deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 1,
        target: "EACH_OPPONENT",
        destinations: [
          {
            zone: "deck-top",
            remainder: true,
          },
        ],
      },
      id: "Sh7-1",
      name: "ALL WILL BE SEEN",
      text: "ALL WILL BE SEEN When you play this character, look at the top card of each opponent's deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: theFatesOnlyOneEyeI18n,
};
