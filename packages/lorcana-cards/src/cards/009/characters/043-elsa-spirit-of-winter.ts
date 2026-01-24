import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSpiritOfWinter: CharacterCard = {
  id: "95w",
  cardType: "character",
  name: "Elsa",
  version: "Spirit of Winter",
  fullName: "Elsa - Spirit of Winter",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "009",
  text: "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Elsa.)\nDEEP FREEZE When you play this character, exert up to 2 chosen characters. They can’t ready at the start of their next turn.",
  cost: 8,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 43,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2106d745670d1cd790b5b9a3761e99544502433f",
  },
  abilities: [
    {
      id: "95w-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
      text: "Shift 6 {I}",
    },
    {
      id: "95w-2",
      type: "triggered",
      name: "DEEP FREEZE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "DEEP FREEZE When you play this character, exert up to 2 chosen characters. They can’t ready at the start of their next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};
