import type { CharacterCard } from "@tcg/lorcana-types";
import { todKnowsAllTheTricksI18n } from "./092-tod-knows-all-the-tricks.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const todKnowsAllTheTricks: CharacterCard = {
  id: "WP5",
  canonicalId: "ci_0ez",
  reprints: ["set11-092"],
  cardType: "character",
  name: "Tod",
  version: "Knows All the Tricks",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 92,
  rarity: "legendary",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2319774247e242a19dfa6a0fe584fff0",
    tcgPlayer: 677163,
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Evasive",
    },
    {
      title: "IMPRESSIVE LEAPS",
      description:
        "Twice during your turn, whenever this character is chosen for an action or an item's ability, you may ready him.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(5),
    evasive,
    {
      id: "15s-3",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "ready",
        },
        type: "optional",
      },
      name: "IMPRESSIVE LEAPS",
      trigger: {
        event: "be-chosen",
        timing: "whenever",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "n-times-per-turn",
            count: 2,
          },
        ],
        sourceFilter: {
          cardType: ["action", "item"],
        },
      },
      type: "triggered",
      text: "IMPRESSIVE LEAPS Twice during your turn, whenever this character is chosen for an action or an item’s ability, you may ready him.",
    },
  ],
  i18n: todKnowsAllTheTricksI18n,
};
