import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckSapphireChampion: CharacterCard = {
  id: "107",
  cardType: "character",
  name: "Daisy Duck",
  version: "Sapphire Champion",
  fullName: "Daisy Duck - Sapphire Champion",
  inkType: ["sapphire"],
  set: "010",
  text: "STAND FAST Your other Sapphire characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nLOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 158,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8273e51ca5ba49aaebe8b395cd2687bc0abf59e0",
  },
  abilities: [
    {
      id: "107-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      name: "STAND FAST Your other Sapphire",
      text: "STAND FAST Your other Sapphire characters gain Resist +1.",
    },
    {
      id: "107-2",
      type: "triggered",
      name: "LOOK AHEAD",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "LOOK AHEAD Whenever one of your other Sapphire characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
