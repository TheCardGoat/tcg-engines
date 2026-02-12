import type { CharacterCard } from "@tcg/lorcana-types";

export const basilUndercoverDetective: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1n7-1",
      name: "INCAPACITATE",
      text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 7,
  externalIds: {
    ravensburger: "d557e83f557eeed52f4528785eb15321f03c453c",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Undercover Detective",
  id: "1n7",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Basil",
  set: "008",
  strength: 5,
  text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.\nINTERFERE Whenever this character quests, chosen opponent discards a card at random.",
  version: "Undercover Detective",
  willpower: 4,
};
