import type { CharacterCard } from "@tcg/lorcana-types";

export const LefouInstigator: CharacterCard = {
  id: "dx9",
  cardType: "character",
  name: "Lefou",
  version: "Instigator",
  fullName: "Lefou - Instigator",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**FAN THE FLAMES** When you play this character, ready chosen character. They can",
      id: "dx9-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
