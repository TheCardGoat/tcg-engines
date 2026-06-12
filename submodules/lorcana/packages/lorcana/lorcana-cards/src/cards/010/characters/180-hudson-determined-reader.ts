import type { CharacterCard } from "@tcg/lorcana-types";
import { hudsonDeterminedReaderI18n } from "./180-hudson-determined-reader.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const hudsonDeterminedReader: CharacterCard = {
  id: "4NX",
  canonicalId: "ci_4NX",
  reprints: ["set10-180"],
  cardType: "character",
  name: "Hudson",
  version: "Determined Reader",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 180,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_02e6e99d68464f9894c940f686132741",
    tcgPlayer: 658746,
  },
  text: [
    {
      title: "FINDING ANSWERS",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Gargoyle"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
            },
          ],
        },
        type: "optional",
      },
      id: "g6l-1",
      name: "FINDING ANSWERS",
      text: "FINDING ANSWERS When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    stoneByDay,
  ],
  i18n: hudsonDeterminedReaderI18n,
};
