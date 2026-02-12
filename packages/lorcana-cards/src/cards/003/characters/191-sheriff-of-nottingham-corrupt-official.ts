import type { CharacterCard } from "@tcg/lorcana-types";

export const sheriffOfNottinghamCorruptOfficial: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "opponent",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1mi-1",
      name: "TAXES SHOULD HURT",
      text: "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Dreamborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "d20d32a55ec2df0ff6790459048a6633003d8cd3",
  },
  franchise: "Robin Hood",
  fullName: "Sheriff of Nottingham - Corrupt Official",
  id: "1mi",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Sheriff of Nottingham",
  set: "003",
  strength: 2,
  text: "TAXES SHOULD HURT Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
  version: "Corrupt Official",
  willpower: 4,
};
