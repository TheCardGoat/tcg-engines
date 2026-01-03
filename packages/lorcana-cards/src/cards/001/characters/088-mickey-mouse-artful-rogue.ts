import type { CharacterCard } from "@tcg/lorcana-types";

export const MickeyMouseArtfulRogue: CharacterCard = {
  id: "dul",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Artful Rogue",
  fullName: "Mickey Mouse - Artful Rogue",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
      id: "dul-1",
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
  classifications: ["Hero", "Floodborn"],
};
