import type { CharacterCard } from "@tcg/lorcana-types";

export const aresGodOfWar: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            chooser: "CONTROLLER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      id: "3s2-1",
      name: "Reckless CALL TO BATTLE Once",
      text: "Reckless CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Storyborn", "Deity"],
  cost: 2,
  externalIds: {
    ravensburger: "0d9f37f549c31a2ff2bb7bb968f6d2adc8591fac",
  },
  franchise: "Hercules",
  fullName: "Ares - God of War",
  id: "3s2",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  name: "Ares",
  set: "010",
  strength: 3,
  text: "Reckless (This character can't quest and must challenge each turn if able.) CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
  version: "God of War",
  willpower: 3,
};
