import type { CharacterCard } from "@tcg/lorcana-types";

export const candleheadDedicatedRacer: CharacterCard = {
  id: "w07",
  cardType: "character",
  name: "Candlehead",
  version: "Dedicated Racer",
  fullName: "Candlehead - Dedicated Racer",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "735997cb2d2bb3550d9657a45ff6656a73b7c2eb",
  },
  abilities: [
    {
      id: "w07-1",
      type: "triggered",
      name: "WINNING ISN'T EVERYTHING",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
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
      text: "WINNING ISN'T EVERYTHING When this character is banished, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Racer"],
};
