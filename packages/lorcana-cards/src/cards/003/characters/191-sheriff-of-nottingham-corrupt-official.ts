import type { CharacterCard } from "@tcg/lorcana-types";

export const sheriffOfNottinghamCorruptOfficial: CharacterCard = {
  id: "1mi",
  cardType: "character",
  name: "Sheriff of Nottingham",
  version: "Corrupt Official",
  fullName: "Sheriff of Nottingham - Corrupt Official",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  text: "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 191,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d20d32a55ec2df0ff6790459048a6633003d8cd3",
  },
  abilities: [
    {
      id: "1mi-1",
      type: "triggered",
      name: "TAXES SHOULD HURT",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
