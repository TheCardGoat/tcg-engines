import type { CharacterCard } from "@tcg/lorcana-types";
import { goofySetForAdventureI18n } from "./074-goofy-set-for-adventure.i18n";

export const goofySetForAdventure: CharacterCard = {
  id: "RnM",
  canonicalId: "ci_vZ9",
  reprints: ["set9-074"],
  cardType: "character",
  name: "Goofy",
  version: "Set for Adventure",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 74,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bc96b5e1045e45a38da57c302c634ba2",
    tcgPlayer: 650147,
  },
  text: [
    {
      title: "FAMILY VACATION",
      description:
        "Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "1yc-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              character: "ANOTHER_CHOSEN_CHARACTER_OF_YOURS",
              cost: "free",
              location: {
                ref: "trigger-destination",
              },
              type: "move-to-location",
            },
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      name: "FAMILY VACATION Once",
      trigger: {
        event: "move",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "first-time-each-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
      text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
    },
  ],
  i18n: goofySetForAdventureI18n,
};
