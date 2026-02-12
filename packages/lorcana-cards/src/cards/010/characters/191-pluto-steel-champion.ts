import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoSteelChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1g1-1",
      name: "WINNER TAKE ALL",
      text: "WINNER TAKE ALL During your turn, whenever one of your other Steel characters banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1g1-2",
      name: "MAKE ROOM",
      text: "MAKE ROOM Whenever you play another Steel character, you may banish chosen item.",
      trigger: { event: "play", on: "SELF", timing: "when" },
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
