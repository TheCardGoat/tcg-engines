import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoSteelChampion: CharacterCard = {
  id: "1g1",
  cardType: "character",
  name: "Pluto",
  version: "Steel Champion",
  fullName: "Pluto - Steel Champion",
  inkType: ["steel"],
  set: "010",
  text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 191,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "054d01b8c7262fc35deae953e21e415e967fe99b",
  },
  abilities: [
    {
      id: "1g1-1",
      type: "triggered",
      name: "WINNER TAKE ALL",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
    },
    {
      id: "1g1-2",
      type: "triggered",
      name: "MAKE ROOM",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
