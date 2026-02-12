import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukLivelyPartner: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "1qb-1",
      name: "Evasive ON A ROLL",
      text: "Evasive ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 129,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "e0924443108d0df64a23851b0300bc32953f3c15",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Tuk Tuk - Lively Partner",
  id: "1qb",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tuk Tuk",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.) ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
  version: "Lively Partner",
  willpower: 3,
};
