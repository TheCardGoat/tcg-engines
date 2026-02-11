import type { CharacterCard } from "@tcg/lorcana-types";

export const wasabiMethodicalEngineer: CharacterCard = {
  abilities: [
    {
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
      id: "l5t-1",
      name: "BLADES OF FURY",
      text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "l5t-2",
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "4c44b7fca1f2f6a3616e9dc982897df5179befa0",
  },
  franchise: "Big Hero 6",
  fullName: "Wasabi - Methodical Engineer",
  id: "l5t",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Wasabi",
  set: "006",
  strength: 3,
  text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Methodical Engineer",
  willpower: 3,
};
