import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  abilities: [
    {
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
      id: "wy2-1",
      name: "WONDER BOY",
      text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 79,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "76be007752f1625ad8261741ec543a1ef1682a2c",
  },
  franchise: "Hercules",
  fullName: "Megara - Pulling the Strings",
  id: "wy2",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Megara",
  set: "009",
  strength: 2,
  text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
  version: "Pulling the Strings",
  willpower: 1,
};
