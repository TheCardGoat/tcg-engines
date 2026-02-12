import type { CharacterCard } from "@tcg/lorcana-types";

export const scarBetrayer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1rc-1",
      name: "LONG LIVE THE KING",
      text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "e32abffa68664089a138943286790c91aa3b29ed",
  },
  franchise: "Lion King",
  fullName: "Scar - Betrayer",
  id: "1rc",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Scar",
  set: "005",
  strength: 6,
  text: "LONG LIVE THE KING When you play this character, you may banish chosen character named Mufasa.",
  version: "Betrayer",
  willpower: 3,
};
