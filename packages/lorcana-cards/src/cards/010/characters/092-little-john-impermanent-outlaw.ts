import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnImpermanentOutlaw: CharacterCard = {
  abilities: [
    {
      id: "196-1",
      keyword: "Boost",
      text: "Boost 3 {I}",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "ready",
      },
      id: "196-2",
      name: "READY TO RASSLE",
      text: "READY TO RASSLE Whenever you put a card under this character, ready him.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 92,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Whisper"],
  cost: 6,
  externalIds: {
    ravensburger: "a2df8f284f006d9047e4f3ea54e2828ecf646753",
  },
  franchise: "Robin Hood",
  fullName: "Little John - Impermanent Outlaw",
  id: "196",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Little John",
  set: "010",
  strength: 4,
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.",
  version: "Impermanent Outlaw",
  willpower: 5,
};
