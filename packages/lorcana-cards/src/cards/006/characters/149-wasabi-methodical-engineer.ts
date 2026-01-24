import type { CharacterCard } from "@tcg/lorcana-types";

export const wasabiMethodicalEngineer: CharacterCard = {
  id: "l5t",
  cardType: "character",
  name: "Wasabi",
  version: "Methodical Engineer",
  fullName: "Wasabi - Methodical Engineer",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 149,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4c44b7fca1f2f6a3616e9dc982897df5179befa0",
  },
  abilities: [
    {
      id: "l5t-1",
      type: "triggered",
      name: "BLADES OF FURY",
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
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.",
    },
    {
      id: "l5t-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
