import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "wy2-1",
      name: "WONDER BOY",
      text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
