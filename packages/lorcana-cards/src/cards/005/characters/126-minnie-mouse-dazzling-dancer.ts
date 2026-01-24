import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDazzlingDancer: CharacterCard = {
  id: "git",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Dazzling Dancer",
  fullName: "Minnie Mouse - Dazzling Dancer",
  inkType: ["ruby"],
  set: "005",
  text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3b8ce9d853822f37f2a8ccdac5ba917bd8570611",
  },
  abilities: [
    {
      id: "git-1",
      type: "triggered",
      name: "DANCE-OFF",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
