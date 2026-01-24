import type { CharacterCard } from "@tcg/lorcana-types";

export const basilUndercoverDetective: CharacterCard = {
  id: "1n7",
  cardType: "character",
  name: "Basil",
  version: "Undercover Detective",
  fullName: "Basil - Undercover Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "008",
  text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.\nINTERFERE Whenever this character quests, chosen opponent discards a card at random.",
  cost: 7,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 86,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d557e83f557eeed52f4528785eb15321f03c453c",
  },
  abilities: [
    {
      id: "1n7-1",
      type: "triggered",
      name: "INCAPACITATE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
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
      text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
