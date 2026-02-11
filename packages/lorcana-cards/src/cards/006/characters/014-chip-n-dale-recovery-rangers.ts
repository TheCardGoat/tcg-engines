import type { CharacterCard } from "@tcg/lorcana-types";

export const chipNDaleRecoveryRangers: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1bs-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      id: "1bs-3",
      name: "SEARCH AND RESCUE",
      text: "SEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 8,
  externalIds: {
    ravensburger: "04c91810f3fc39ddc8a72d65dbdc698847565330",
  },
  franchise: "Rescue Rangers",
  fullName: "Chip 'n' Dale - Recovery Rangers",
  id: "1bs",
  inkType: ["amber"],
  inkable: false,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Chip 'n' Dale",
  set: "006",
  strength: 6,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
  version: "Recovery Rangers",
  willpower: 6,
};
