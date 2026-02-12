import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaOfMotunui: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
              type: "ready",
            },
            type: "optional",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "n94-1",
      name: "WE CAN FIX IT",
      text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "0253f6c8757d9698e3b28f4f973b3ccc6d5bd4ae",
  },
  franchise: "Moana",
  fullName: "Moana - Of Motunui",
  id: "n94",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Moana",
  set: "009",
  strength: 1,
  text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
  version: "Of Motunui",
  willpower: 6,
};
