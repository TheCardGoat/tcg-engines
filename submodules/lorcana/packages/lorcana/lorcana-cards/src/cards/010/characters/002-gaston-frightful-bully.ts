import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { gastonFrightfulBullyI18n } from "./002-gaston-frightful-bully.i18n";

export const gastonFrightfulBully: CharacterCard = {
  id: "Kjy",
  canonicalId: "ci_JyZ",
  reprints: ["set10-002"],
  cardType: "character",
  name: "Gaston",
  version: "Frightful Bully",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "010",
  cardNumber: 2,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_22fb811c179742f6b17bead54e0d68f2",
    tcgPlayer: 657888,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "TOP THAT!",
      description:
        "Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
  abilities: [
    boost(2),
    {
      condition: {
        type: "has-card-under",
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
      id: "14y-2",
      name: "TOP THAT!",
      text: "TOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: gastonFrightfulBullyI18n,
};
