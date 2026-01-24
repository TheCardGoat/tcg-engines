import type { CharacterCard } from "@tcg/lorcana-types";

export const rabbitIndignantPirate: CharacterCard = {
  id: "1cx",
  cardType: "character",
  name: "Rabbit",
  version: "Indignant Pirate",
  fullName: "Rabbit - Indignant Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 22,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b04d53c72e0daaa51190f5bfd88e9191a2d259cc",
  },
  abilities: [
    {
      id: "1cx-1",
      type: "triggered",
      name: "BE MORE CAREFUL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          upTo: true,
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
      text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Pirate"],
};
