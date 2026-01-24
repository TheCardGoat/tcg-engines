import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaOfMotunui: CharacterCard = {
  id: "n94",
  cardType: "character",
  name: "Moana",
  version: "Of Motunui",
  fullName: "Moana - Of Motunui",
  inkType: ["amber"],
  franchise: "Moana",
  set: "009",
  text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
  cost: 5,
  strength: 1,
  willpower: 6,
  lore: 3,
  cardNumber: 20,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0253f6c8757d9698e3b28f4f973b3ccc6d5bd4ae",
  },
  abilities: [
    {
      id: "n94-1",
      type: "triggered",
      name: "WE CAN FIX IT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
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
      text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
