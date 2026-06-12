import type { CharacterCard } from "@tcg/lorcana-types";
import { theHornedKingWickedRulerI18n } from "./036-the-horned-king-wicked-ruler.i18n";

export const theHornedKingWickedRuler: CharacterCard = {
  id: "siB",
  canonicalId: "ci_yas",
  reprints: ["set10-036"],
  cardType: "character",
  name: "The Horned King",
  version: "Wicked Ruler",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 36,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_831e34ca1c2143dd82785500356c339e",
    tcgPlayer: 660044,
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "ARISE!",
      description:
        "Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Sorcerer"],
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "wsd-1",
      keyword: "Shift",
      text: "Shift 2 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                ref: "trigger-source",
              },
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
        },
      },
      id: "wsd-2",
      name: "ARISE!",
      text: "ARISE! Whenever one of your other characters is banished in a challenge, you may return that card to your hand, then choose and discard a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: theHornedKingWickedRulerI18n,
};
