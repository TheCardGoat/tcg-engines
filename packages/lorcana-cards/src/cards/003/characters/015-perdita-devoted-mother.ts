import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaDevotedMother: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "discard",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      id: "1dc-1",
      text: "COME ALONG, CHILDREN When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.",
      type: "action",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "b1005675a4c65117f039b0b5707c31167707af7b",
  },
  franchise: "101 Dalmatians",
  fullName: "Perdita - Devoted Mother",
  id: "1dc",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Perdita",
  set: "003",
  strength: 1,
  text: "COME ALONG, CHILDREN When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.",
  version: "Devoted Mother",
  willpower: 6,
};
