import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  id: "wy2",
  cardType: "character",
  name: "Megara",
  version: "Pulling the Strings",
  fullName: "Megara - Pulling the Strings",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 79,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76be007752f1625ad8261741ec543a1ef1682a2c",
  },
  abilities: [
    {
      id: "wy2-1",
      type: "triggered",
      name: "WONDER BOY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
