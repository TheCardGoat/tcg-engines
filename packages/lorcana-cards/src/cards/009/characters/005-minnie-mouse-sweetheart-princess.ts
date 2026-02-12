import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseSweetheartPrincess: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Support",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "ofq-1",
      text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support.",
      type: "action",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "ofq-2",
      text: "BYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
      type: "action",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "5812c94d096ef13f315d9acdc7694bd2e1352abc",
  },
  fullName: "Minnie Mouse - Sweetheart Princess",
  id: "ofq",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Minnie Mouse",
  set: "009",
  strength: 2,
  text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
  version: "Sweetheart Princess",
  willpower: 4,
};
