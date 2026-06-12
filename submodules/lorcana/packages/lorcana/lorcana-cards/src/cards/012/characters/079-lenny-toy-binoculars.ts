import type { CharacterCard } from "@tcg/lorcana-types";
import { lennyToyBinocularsI18n } from "./079-lenny-toy-binoculars.i18n";

export const lennyToyBinoculars: CharacterCard = {
  id: "egA",
  canonicalId: "ci_egA",
  reprints: ["set12-079"],
  cardType: "character",
  name: "Lenny",
  version: "Toy Binoculars",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 79,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_58a1ca8c3c3c4dfa9deebc214c49e4b1",
  },
  text: [
    {
      title: "TAKE",
      description:
        "A GOOD LOOK When you play this character, chosen opponent reveals their hand and discards an action card of your choice.",
    },
    {
      title: "COMIN' UP FAST",
      description:
        "Once during your turn, whenever you play an action, you may ready this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Toy"],
  abilities: [
    {
      id: "J7N-1",
      name: "TAKE A GOOD LOOK",
      type: "triggered",
      text: "TAKE A GOOD LOOK When you play this character, chosen opponent reveals their hand and discards an action card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              cardType: "action",
            },
          },
        ],
      },
    },
    {
      id: "J7N-2",
      name: "COMIN' UP FAST",
      type: "triggered",
      text: "COMIN' UP FAST Once during your turn, whenever you play an action, you may ready this character.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "action",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "first-time-each-turn",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "ready",
          target: "SELF",
        },
      },
    },
  ],
  i18n: lennyToyBinocularsI18n,
};
