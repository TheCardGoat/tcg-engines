import type { CharacterCard } from "@tcg/lorcana-types";

export const peteSteamboatRival: CharacterCard = {
  id: "nvb",
  cardType: "character",
  name: "Pete",
  version: "Steamboat Rival",
  fullName: "Pete - Steamboat Rival",
  inkType: ["ruby"],
  set: "005",
  text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 116,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "560738cc26ab41c3b9302243666e56a60e99e4df",
  },
  abilities: [
    {
      id: "nvb-1",
      type: "triggered",
      name: "SCRAM!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
