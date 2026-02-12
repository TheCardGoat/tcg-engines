import type { CharacterCard } from "@tcg/lorcana-types";

export const peteSteamboatRival: CharacterCard = {
  abilities: [
    {
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
      id: "nvb-1",
      name: "SCRAM!",
      text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 116,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "560738cc26ab41c3b9302243666e56a60e99e4df",
  },
  fullName: "Pete - Steamboat Rival",
  id: "nvb",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pete",
  set: "005",
  strength: 6,
  text: "SCRAM! When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.",
  version: "Steamboat Rival",
  willpower: 6,
};
