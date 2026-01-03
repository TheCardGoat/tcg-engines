import type { CharacterCard } from "@tcg/lorcana-types";

export const ArielWhoseitCollector: CharacterCard = {
  id: "df2",
  cardType: "character",
  name: "Ariel",
  version: "Whoseit Collector",
  fullName: "Ariel - Whoseit Collector",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 137,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};
