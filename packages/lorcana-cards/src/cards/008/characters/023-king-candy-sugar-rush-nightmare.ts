import type { CharacterCard } from "@tcg/lorcana-types";

export const kingCandySugarRushNightmare: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1mh-1",
      name: "A NEW ROSTER",
      text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "King", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "d2cab8910ba9c6d3110900d1d62e58c1914b862a",
  },
  franchise: "Wreck It Ralph",
  fullName: "King Candy - Sugar Rush Nightmare",
  id: "1mh",
  inkType: ["amber", "ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "King Candy",
  set: "008",
  strength: 3,
  text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
  version: "Sugar Rush Nightmare",
  willpower: 2,
};
