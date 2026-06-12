import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckFredHoneywellI18n } from "./093-donald-duck-fred-honeywell.i18n";

export const donaldDuckFredHoneywell: CharacterCard = {
  id: "Yde",
  canonicalId: "ci_Yde",
  reprints: ["set11-093"],
  cardType: "character",
  name: "Donald Duck",
  version: "Fred Honeywell",
  inkType: ["emerald"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 93,
  rarity: "legendary",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ad5cc52cd5f49bb9594afa82796f42e",
    tcgPlayer: 673331,
  },
  text: [
    {
      title: "SPIRIT OF GIVING",
      description:
        "Whenever you use the Boost ability of a character, you may put the top card of your deck under them facedown.",
    },
    {
      title: "WELL WISHES",
      description:
        "During opponents' turns, whenever one of your other characters is banished, you may draw a card for each card that was under them.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "Yde-1",
      name: "SPIRIT OF GIVING",
      text: "SPIRIT OF GIVING Whenever you use the Boost ability of a character, you may put the top card of your deck under them facedown.",
      type: "triggered",
      trigger: {
        event: "boost",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-under",
          source: "top-of-deck",
          under: {
            ref: "trigger-subject",
          },
        },
      },
    },
    {
      id: "Yde-2",
      name: "WELL WISHES",
      text: "WELL WISHES During opponents' turns, whenever one of your other characters is banished, you may draw a card for each card that was under them.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      condition: {
        type: "trigger-subject-had-card-under",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: {
            type: "trigger-target-attribute",
            attribute: "cards-under-count-before-banish",
          },
        },
      },
    },
  ],
  i18n: donaldDuckFredHoneywellI18n,
};
