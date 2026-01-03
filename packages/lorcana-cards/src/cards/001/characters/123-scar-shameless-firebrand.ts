import type { CharacterCard } from "@tcg/lorcana-types";

export const ScarShamelessFirebrand: CharacterCard = {
  id: "mm7",
  cardType: "character",
  name: "Scar",
  version: "Shameless Firebrand",
  fullName: "Scar - Shameless Firebrand",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 1,
  cardNumber: 123,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
      id: "mm7-1",
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
  classifications: ["Floodborn", "Villain", "King"],
};
