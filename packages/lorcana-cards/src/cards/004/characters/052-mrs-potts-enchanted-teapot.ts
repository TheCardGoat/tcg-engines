import type { CharacterCard } from "@tcg/lorcana";

export const mrsPottsEnchantedTeapot: CharacterCard = {
  id: "1mj",
  cardType: "character",
  name: "Mrs. Potts",
  version: "Enchanted Teapot",
  fullName: "Mrs. Potts - Enchanted Teapot",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 52,
  inkable: true,
  externalIds: {
    ravensburger: "d2fc1a97d9660d223273dc3416d8fa2ad2e68950",
  },
  abilities: [
    {
      id: "1mj-1",
      text: "IT'LL TURN OUT ALL RIGHT When you play this character, if you have a character named Lumiere or Cogsworth in play, you may draw a card.",
      name: "IT'LL TURN OUT ALL RIGHT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          // NOTE: Card text says "Lumiere OR Cogsworth" but type only supports single name
          // Runtime would need to check for either. Modeling as Lumiere for now.
          type: "has-named-character",
          name: "Lumiere",
          controller: "you",
        },
        then: {
          type: "optional",
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          chooser: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
