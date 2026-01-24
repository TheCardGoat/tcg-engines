import type { CharacterCard } from "@tcg/lorcana-types";

export const aresGodOfWar: CharacterCard = {
  id: "3s2",
  cardType: "character",
  name: "Ares",
  version: "God of War",
  fullName: "Ares - God of War",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "Reckless (This character can't quest and must challenge each turn if able.) CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  cardNumber: 104,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0d9f37f549c31a2ff2bb7bb968f6d2adc8591fac",
  },
  abilities: [
    {
      id: "3s2-1",
      type: "triggered",
      name: "Reckless CALL TO BATTLE Once",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
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
      text: "Reckless CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Deity"],
};
