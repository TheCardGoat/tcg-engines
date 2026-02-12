import type { CharacterCard } from "@tcg/lorcana-types";

export const hiramFlavershamToymaker: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "slt-1",
      name: "ARTIFICER When you play this character and",
      text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Storyborn", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "671965c7095dd8a31d791f102a4dc3e789f6a21b",
  },
  franchise: "Great Mouse Detective",
  fullName: "Hiram Flaversham - Toymaker",
  id: "slt",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hiram Flaversham",
  set: "002",
  strength: 1,
  text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
  version: "Toymaker",
  willpower: 6,
};
