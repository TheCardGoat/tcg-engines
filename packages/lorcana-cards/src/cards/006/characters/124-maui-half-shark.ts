import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHalfshark: CharacterCard = {
  abilities: [
    {
      id: "rcf-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "action",
        },
        type: "optional",
      },
      id: "rcf-2",
      name: "CHEEEEOHOOOO!",
      text: "CHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "rcf-3",
      name: "WAYFINDING",
      text: "WAYFINDING Whenever you play an action, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "628de10fb7ee738534e61c94d7bd1f30da4589dd",
  },
  franchise: "Moana",
  fullName: "Maui - Half-Shark",
  id: "rcf",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Maui",
  set: "006",
  strength: 7,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.",
  version: "Half-Shark",
  willpower: 5,
};
