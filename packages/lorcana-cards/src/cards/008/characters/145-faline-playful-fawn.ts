import type { CharacterCard } from "@tcg/lorcana-types";

export const falinePlayfulFawn: CharacterCard = {
  id: "12c",
  cardType: "character",
  name: "Faline",
  version: "Playful Fawn",
  fullName: "Faline - Playful Fawn",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 145,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8a3ab5a8243de7387068a90640536421e6ba2a47",
  },
  abilities: [
    {
      id: "12c-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "12c-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "PRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
