import type { CharacterCard } from "@tcg/lorcana";

export const hiramFlavershamToymaker: CharacterCard = {
  id: "slt",
  cardType: "character",
  name: "Hiram Flaversham",
  version: "Toymaker",
  fullName: "Hiram Flaversham - Toymaker",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  cardNumber: 149,
  inkable: true,
  externalIds: {
    ravensburger: "671965c7095dd8a31d791f102a4dc3e789f6a21b",
  },
  abilities: [
    {
      id: "slt-1",
      text: "ARTIFICER When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
      name: "ARTIFICER",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Inventor"],
};
