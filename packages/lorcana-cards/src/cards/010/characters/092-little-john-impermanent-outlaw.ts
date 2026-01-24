import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnImpermanentOutlaw: CharacterCard = {
  id: "196",
  cardType: "character",
  name: "Little John",
  version: "Impermanent Outlaw",
  fullName: "Little John - Impermanent Outlaw",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "010",
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 3,
  cardNumber: 92,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a2df8f284f006d9047e4f3ea54e2828ecf646753",
  },
  abilities: [
    {
      id: "196-1",
      type: "keyword",
      keyword: "Boost",
      value: 3,
      text: "Boost 3 {I}",
    },
    {
      id: "196-2",
      type: "triggered",
      name: "READY TO RASSLE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "ready",
        target: "CHOSEN_CHARACTER",
      },
      text: "READY TO RASSLE Whenever you put a card under this character, ready him.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
};
