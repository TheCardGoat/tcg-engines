import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiStubbornTrickster: CharacterCard = {
  id: "1m3",
  cardType: "character",
  name: "Maui",
  version: "Stubborn Trickster",
  fullName: "Maui - Stubborn Trickster",
  inkType: ["emerald", "steel"],
  franchise: "Moana",
  set: "008",
  text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 110,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2a45653b90b954304d34f83f5eeafae952d560d",
  },
  abilities: [
    {
      id: "1m3-2",
      type: "action",
      effect: {
        type: "put-damage",
        amount: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "- Put 2 damage counters on all opposing characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};
