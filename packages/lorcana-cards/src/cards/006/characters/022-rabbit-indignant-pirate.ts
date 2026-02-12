import type { CharacterCard } from "@tcg/lorcana-types";

export const rabbitIndignantPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "1cx-1",
      name: "BE MORE CAREFUL",
      text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Pirate"],
  cost: 1,
  externalIds: {
    ravensburger: "b04d53c72e0daaa51190f5bfd88e9191a2d259cc",
  },
  franchise: "Winnie the Pooh",
  fullName: "Rabbit - Indignant Pirate",
  id: "1cx",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Rabbit",
  set: "006",
  strength: 1,
  text: "BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.",
  version: "Indignant Pirate",
  willpower: 2,
};
