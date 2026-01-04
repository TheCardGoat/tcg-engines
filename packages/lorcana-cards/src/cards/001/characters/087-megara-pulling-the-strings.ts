import type { CharacterCard } from "@tcg/lorcana-types";

export const megarapullingTheStrings: CharacterCard = {
  id: "kv6",
  cardType: "character",
  name: "Megara",
  version: "Pulling the Strings",
  fullName: "Megara - Pulling the Strings",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
      id: "kv6-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
