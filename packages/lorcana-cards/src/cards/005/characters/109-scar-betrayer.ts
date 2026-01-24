import type { CharacterCard } from "@tcg/lorcana-types";

export const scarBetrayer: CharacterCard = {
  id: "1rc",
  cardType: "character",
  name: "Scar",
  version: "Betrayer",
  fullName: "Scar - Betrayer",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "005",
  text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
  cost: 5,
  strength: 6,
  willpower: 3,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e32abffa68664089a138943286790c91aa3b29ed",
  },
  abilities: [
    {
      id: "1rc-1",
      type: "triggered",
      name: "LONG LIVE THE KING",
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
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
