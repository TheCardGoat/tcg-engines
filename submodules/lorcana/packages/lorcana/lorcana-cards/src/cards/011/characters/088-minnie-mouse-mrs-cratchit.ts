import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseMrsCratchitI18n } from "./088-minnie-mouse-mrs-cratchit.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const minnieMouseMrsCratchit: CharacterCard = {
  id: "g4Z",
  canonicalId: "ci_mKu",
  reprints: ["set11-088"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Mrs. Cratchit",
  inkType: ["emerald"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 88,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_84aa488aa433406493abed00a9d99611",
    tcgPlayer: 677148,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "A MOTHER'S LOVE",
      description:
        "When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost. If you do, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      id: "18q-2",
      name: "A MOTHER’S LOVE",
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "put-under",
              source: "top-of-deck",
              under: {
                cardTypes: ["character", "location"],
                count: 1,
                owner: "you",
                selector: "chosen",
                zones: ["play"],
                filter: [
                  {
                    keyword: "Boost",
                    type: "has-keyword",
                  },
                ],
              },
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "A MOTHER’S LOVE When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost. If you do, draw a card.",
    },
  ],
  i18n: minnieMouseMrsCratchitI18n,
};
