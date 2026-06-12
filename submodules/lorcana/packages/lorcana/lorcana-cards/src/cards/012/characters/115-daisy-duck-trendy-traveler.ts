import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckTrendyTravelerI18n } from "./115-daisy-duck-trendy-traveler.i18n";

export const daisyDuckTrendyTraveler: CharacterCard = {
  id: "7aI",
  canonicalId: "ci_7aI",
  reprints: ["set12-115"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Trendy Traveler",
  inkType: ["ruby"],
  set: "012",
  cardNumber: 115,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_995abfb15ba34115bbf2283bd853c2c2",
  },
  text: [
    {
      title: "BREAK IS OVER",
      description:
        "Whenever this character quests, if you played a character this turn, you may ready another chosen character. If you do, they can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "7aI-1",
      name: "BREAK IS OVER",
      type: "triggered",
      text: "BREAK IS OVER Whenever this character quests, if you played a character this turn, you may ready another chosen character. If you do, they can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
            },
            {
              type: "restriction",
              restriction: "cant-quest",
              duration: "this-turn",
              target: {
                reference: "selected-first",
              },
            },
          ],
        },
      },
    },
  ],
  i18n: daisyDuckTrendyTravelerI18n,
};
