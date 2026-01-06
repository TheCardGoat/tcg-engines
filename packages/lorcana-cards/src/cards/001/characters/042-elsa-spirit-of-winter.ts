import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSpiritOfWinter: CharacterCard = {
  id: "qc4",
  cardType: "character",
  name: "Elsa",
  version: "Spirit of Winter",
  fullName: "Elsa - Spirit of Winter",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
  cost: 8,
  strength: 4,
  willpower: 6,
  lore: 3,
  cardNumber: 42,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can",
      id: "qc4-1",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Floodborn", "Queen", "Sorcerer"],
};
