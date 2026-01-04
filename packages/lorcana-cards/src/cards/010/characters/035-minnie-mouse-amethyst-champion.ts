import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseAmethystChampion: CharacterCard = {
  id: "1kv",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Amethyst Champion",
  fullName: "Minnie Mouse - Amethyst Champion",
  inkType: ["amethyst"],
  set: "010",
  text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "ccf42c36e04eff8e85e6c695ec9ed7ae661666f7",
  },
  abilities: [
    {
      id: "1kv-1",
      name: "MYSTICAL BALANCE",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
