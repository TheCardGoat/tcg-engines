import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonIntellectualPowerhouseI18n } from "./147-gaston-intellectual-powerhouse.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const gastonIntellectualPowerhouse: CharacterCard = {
  id: "E5w",
  canonicalId: "ci_E5w",
  reprints: ["set2-147"],
  cardType: "character",
  name: "Gaston",
  version: "Intellectual Powerhouse",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 147,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_f3d2d4123acd473da89b7358ae6dc5e4",
    tcgPlayer: 516406,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "DEVELOPED BRAIN",
      description:
        "When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(4),
    {
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "14c-2",
      name: "DEVELOPED BRAIN",
      text: "DEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: gastonIntellectualPowerhouseI18n,
};
