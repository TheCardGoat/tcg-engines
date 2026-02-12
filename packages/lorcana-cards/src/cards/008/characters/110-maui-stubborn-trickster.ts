import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiStubbornTrickster: CharacterCard = {
  abilities: [
    {
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
      id: "1m3-2",
      text: "- Put 2 damage counters on all opposing characters.",
      type: "action",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "d2a45653b90b954304d34f83f5eeafae952d560d",
  },
  franchise: "Moana",
  fullName: "Maui - Stubborn Trickster",
  id: "1m3",
  inkType: ["emerald", "steel"],
  inkable: true,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Maui",
  set: "008",
  strength: 4,
  text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
  version: "Stubborn Trickster",
  willpower: 4,
};
