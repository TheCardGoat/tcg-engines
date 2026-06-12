import type { CharacterCard } from "@tcg/lorcana-types";
import { cobraBubblesDedicatedOfficialI18n } from "./014-cobra-bubbles-dedicated-official.i18n";

export const cobraBubblesDedicatedOfficial: CharacterCard = {
  id: "gZF",
  canonicalId: "ci_gZF",
  reprints: ["set11-014"],
  cardType: "character",
  name: "Cobra Bubbles",
  version: "Dedicated Official",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 14,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f3b02d0a1478421da5b8ad2dac40d1b0",
    tcgPlayer: 675379,
  },
  text: [
    {
      title: "AURA OF AUTHORITY",
      description:
        "Whenever this character quests, chosen opposing character can't challenge and must quest during their next turn if able.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1he-1",
      name: "AURA OF AUTHORITY",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            restriction: "cant-challenge",
            target: "CHOSEN_OPPOSING_CHARACTER",
            duration: "their-next-turn",
            type: "restriction",
          },
          {
            restriction: "must-quest",
            target: {
              ref: "previous-target",
            },
            duration: "their-next-turn",
            type: "restriction",
          },
        ],
      },
      type: "triggered",
      text: "AURA OF AUTHORITY Whenever this character quests, chosen opposing character can't challenge and must quest during their next turn if able.",
    },
  ],
  i18n: cobraBubblesDedicatedOfficialI18n,
};
