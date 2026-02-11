import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseAmethystChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "1kv-1",
      name: "MYSTICAL BALANCE",
      text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "ccf42c36e04eff8e85e6c695ec9ed7ae661666f7",
  },
  fullName: "Minnie Mouse - Amethyst Champion",
  id: "1kv",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Minnie Mouse",
  set: "010",
  strength: 2,
  text: "MYSTICAL BALANCE Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.",
  version: "Amethyst Champion",
  willpower: 3,
};
