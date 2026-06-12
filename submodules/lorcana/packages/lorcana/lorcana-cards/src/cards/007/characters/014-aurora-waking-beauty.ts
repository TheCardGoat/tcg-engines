import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraWakingBeautyI18n } from "./014-aurora-waking-beauty.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const auroraWakingBeauty: CharacterCard = {
  id: "t37",
  canonicalId: "ci_ove",
  reprints: ["set7-014"],
  cardType: "character",
  name: "Aurora",
  version: "Waking Beauty",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "007",
  cardNumber: 14,
  rarity: "legendary",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_54102dba80604a609eed679b7f33fad3",
    tcgPlayer: 619733,
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "SWEET DREAMS",
      description:
        "Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    singer(5),
    {
      effect: {
        steps: [
          {
            target: "SELF",
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest-or-challenge",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "cy2-2",
      name: "SWEET DREAMS",
      text: "SWEET DREAMS Whenever you remove 1 or more damage from a character, ready this character. She can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "remove-damage",
        on: "YOU",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: auroraWakingBeautyI18n,
};
