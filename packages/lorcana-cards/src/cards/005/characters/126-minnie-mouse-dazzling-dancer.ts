import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDazzlingDancer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "git-1",
      name: "DANCE-OFF",
      text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "3b8ce9d853822f37f2a8ccdac5ba917bd8570611",
  },
  fullName: "Minnie Mouse - Dazzling Dancer",
  id: "git",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "005",
  strength: 2,
  text: "DANCE-OFF Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.",
  version: "Dazzling Dancer",
  willpower: 4,
};
