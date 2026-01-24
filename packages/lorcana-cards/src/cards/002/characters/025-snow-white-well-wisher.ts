import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteWellWisher: CharacterCard = {
  id: "1fh",
  cardType: "character",
  name: "Snow White",
  version: "Well Wisher",
  fullName: "Snow White - Well Wisher",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 25,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b98e167eead8609a7571bb2108cdad63d4cfcfdd",
  },
  abilities: [
    {
      id: "1fh-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1fh-2",
      type: "triggered",
      name: "WISHES COME TRUE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      text: "WISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
