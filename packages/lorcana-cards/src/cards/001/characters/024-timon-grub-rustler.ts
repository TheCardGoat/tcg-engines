import type { CharacterCard } from "@tcg/lorcana-types";

export const timonGrubRustler: CharacterCard = {
  id: "1fm",
  cardType: "character",
  name: "Timon",
  version: "Grub Rustler",
  fullName: "Timon - Grub Rustler",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "001",
  text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 24,
  inkable: true,
  externalIds: {
    ravensburger: "ba040a5f880e4b2b3145703c8510a6d12b985cf9",
  },
  abilities: [
    {
      id: "1fm-1",
      text: "TASTES LIKE CHICKEN When you play this character, you may remove up to 1 damage from chosen character.",
      name: "TASTES LIKE CHICKEN",
      type: "triggered",
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
          target: "CHOSEN_CHARACTER",
          upTo: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
