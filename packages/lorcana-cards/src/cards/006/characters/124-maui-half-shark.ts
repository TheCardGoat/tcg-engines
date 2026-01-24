import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHalfshark: CharacterCard = {
  id: "rcf",
  cardType: "character",
  name: "Maui",
  version: "Half-Shark",
  fullName: "Maui - Half-Shark",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 1,
  cardNumber: 124,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "628de10fb7ee738534e61c94d7bd1f30da4589dd",
  },
  abilities: [
    {
      id: "rcf-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "rcf-2",
      type: "triggered",
      name: "CHEEEEOHOOOO!",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "action",
        },
        chooser: "CONTROLLER",
      },
      text: "CHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.",
    },
    {
      id: "rcf-3",
      type: "triggered",
      name: "WAYFINDING",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "WAYFINDING Whenever you play an action, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};
