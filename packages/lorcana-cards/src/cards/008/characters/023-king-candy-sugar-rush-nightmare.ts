import type { CharacterCard } from "@tcg/lorcana-types";

export const kingCandySugarRushNightmare: CharacterCard = {
  id: "1mh",
  cardType: "character",
  name: "King Candy",
  version: "Sugar Rush Nightmare",
  fullName: "King Candy - Sugar Rush Nightmare",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2cab8910ba9c6d3110900d1d62e58c1914b862a",
  },
  abilities: [
    {
      id: "1mh-1",
      type: "triggered",
      name: "A NEW ROSTER",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Racer"],
};
