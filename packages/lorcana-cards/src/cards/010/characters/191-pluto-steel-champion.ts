import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoSteelChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      id: "1g1-1",
      name: "WINNER TAKE ALL",
      text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
    {
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
      id: "1g1-2",
      name: "MAKE ROOM",
      text: "MAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "054d01b8c7262fc35deae953e21e415e967fe99b",
  },
  fullName: "Pluto - Steel Champion",
  id: "1g1",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pluto",
  set: "010",
  strength: 5,
  text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.\nMAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
  version: "Steel Champion",
  willpower: 5,
};
