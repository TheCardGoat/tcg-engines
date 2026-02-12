import type { CharacterCard } from "@tcg/lorcana-types";

export const falinePlayfulFawn: CharacterCard = {
  abilities: [
    {
      id: "12c-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      id: "12c-2",
      text: "PRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "8a3ab5a8243de7387068a90640536421e6ba2a47",
  },
  franchise: "Bambi",
  fullName: "Faline - Playful Fawn",
  id: "12c",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Faline",
  set: "008",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
  version: "Playful Fawn",
  willpower: 4,
};
