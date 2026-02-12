import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchCreativeThinker: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1w4-1",
      name: "BRAINSTORM",
      text: "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "item",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "f6da830b7096c6853bab316ec8aa8a3436023b1a",
  },
  franchise: "Rescue Rangers",
  fullName: "Gadget Hackwrench - Creative Thinker",
  id: "1w4",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gadget Hackwrench",
  set: "006",
  strength: 1,
  text: "BRAINSTORM Whenever you play an item, this character gets +1 {L} this turn.",
  version: "Creative Thinker",
  willpower: 4,
};
