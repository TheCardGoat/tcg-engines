import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteWellWisher: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1fh-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        type: "optional",
      },
      id: "1fh-2",
      name: "WISHES COME TRUE",
      text: "WISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 25,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "b98e167eead8609a7571bb2108cdad63d4cfcfdd",
  },
  franchise: "Snow White",
  fullName: "Snow White - Well Wisher",
  id: "1fh",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Snow White",
  set: "002",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Snow White.)\nWISHES COME TRUE Whenever this character quests, you may return a character card from your discard to your hand.",
  version: "Well Wisher",
  willpower: 5,
};
