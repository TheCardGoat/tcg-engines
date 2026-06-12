import type { CharacterCard } from "@tcg/lorcana-types";
import { jiminyCricketGhostOfChristmasPastI18n } from "./146-jiminy-cricket-ghost-of-christmas-past.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const jiminyCricketGhostOfChristmasPast: CharacterCard = {
  id: "tRd",
  canonicalId: "ci_dGY",
  reprints: ["set11-146"],
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Ghost of Christmas Past",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 146,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea1ae83b3c414a2a838398390473ebc6",
    tcgPlayer: 677153,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "LOOK INTO YOUR PAST",
      description:
        "Whenever you put a card under this character, you may put a card from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost"],
  abilities: [
    boost(2),
    {
      id: "5um-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "discard",
          target: "CONTROLLER",
          type: "put-into-inkwell",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      name: "LOOK INTO YOUR PAST",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "LOOK INTO YOUR PAST Whenever you put a card under this character, you may put a card from your discard into your inkwell facedown and exerted.",
    },
  ],
  i18n: jiminyCricketGhostOfChristmasPastI18n,
};
