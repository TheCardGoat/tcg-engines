import type { CharacterCard } from "@tcg/lorcana-types";

export const candleheadDedicatedRacer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "w07-1",
      name: "WINNING ISN'T EVERYTHING",
      text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Racer"],
  cost: 2,
  externalIds: {
    ravensburger: "735997cb2d2bb3550d9657a45ff6656a73b7c2eb",
  },
  franchise: "Wreck It Ralph",
  fullName: "Candlehead - Dedicated Racer",
  id: "w07",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Candlehead",
  set: "007",
  strength: 2,
  text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
  version: "Dedicated Racer",
  willpower: 2,
};
