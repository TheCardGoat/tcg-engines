import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSpiritOfWinter: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "95w-1",
      keyword: "Shift",
      text: "Shift 6 {I}",
      type: "keyword",
    },
    {
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
      id: "95w-2",
      name: "DEEP FREEZE",
      text: "DEEP FREEZE When you play this character, exert up to 2 chosen characters. They can’t ready at the start of their next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 43,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  cost: 8,
  externalIds: {
    ravensburger: "2106d745670d1cd790b5b9a3761e99544502433f",
  },
  franchise: "Frozen",
  fullName: "Elsa - Spirit of Winter",
  id: "95w",
  inkType: ["amethyst"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Elsa",
  set: "009",
  strength: 4,
  text: "Shift 6 {I} (You may pay 6 {I} to play this on top of one of your characters named Elsa.)\nDEEP FREEZE When you play this character, exert up to 2 chosen characters. They can’t ready at the start of their next turn.",
  version: "Spirit of Winter",
  willpower: 6,
};
